'use server';

import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function fetchDoctorsServer() {
  try {
    const { data: usersData, error: usersError } = await supabase
      .from('User')
      .select('*')
      .eq('role', 'DOCTOR');

    if (usersError) throw usersError;
    return { success: true, data: usersData };
  } catch (error: any) {
    console.error("Server Action fetchDoctorsServer error:", error);
    return { success: false, error: error?.message || 'Failed to fetch doctors' };
  }
}

export async function createDoctorServer(params: {
  p_email: string;
  p_password: string;
  p_name: string;
  p_role: string;
}) {
  try {
    console.log("Calling create_staff_user with:", { ...params, p_password: '***' });
    const { data: rpcData, error: rpcError } = await supabase.rpc('create_staff_user', params);
    
    if (rpcError) {
      console.error("RPC execution error:", rpcError);
      throw rpcError;
    }

    console.log("RPC Response:", rpcData);
    
    if (rpcData && typeof rpcData === 'string' && rpcData.startsWith('ERROR:')) {
      throw new Error(rpcData.replace('ERROR: ', ''));
    }
    
    return { success: true, data: rpcData };
  } catch (error: any) {
    console.error("Server Action createDoctorServer complete failure:", error);
    
    // Specialize error messages for known DB issues
    let userMessage = 'Failed to create doctor';
    if (error?.message?.includes('Role')) {
      userMessage = 'خطأ في نوع صلاحية المستخدم. يرجى التأكد من تعريف الـ Role بشكل صحيح في قاعدة البيانات.';
    } else if (error?.message?.includes('violates unique constraint')) {
      userMessage = 'هذا البريد الإلكتروني مسجل مسبقاً.';
    }
    return { success: false, error: userMessage };
  }
}


export async function inviteDoctorAction(params: {
  email: string;
  phone?: string;
  specialization: string;
}) {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const baseUrl = 'https://rosita-two.vercel.app';
    const inviteLink = `${baseUrl}/invite/${token}`;
    
    const { data: inviteData, error: inviteError } = await supabase
      .from('Invitations')
      .insert({
        email: params.email,
        phone: params.phone || null,
        specialization: params.specialization,
        token: token,
        expires_at: expiresAt.toISOString(),
        role: 'DOCTOR'
      })
      .select()
      .single();

    if (inviteError) throw inviteError;

    // Construct WhatsApp Link
    const message = encodeURIComponent(
      `مرحباً دكتور، نتشرف بدعوتك للانضمام إلى منصة روشتة (Roshita). 🩺\n\n` +
      `يرجى إكمال ملفك الشخصي عبر الرابط التالي (صالح لمدة 24 ساعة):\n${inviteLink}`
    );
    const whatsappLink = `https://wa.me/${params.phone?.replace('+', '')}?text=${message}`;

    console.log("Invitation Created. Link:", inviteLink);
    // In a real app, you'd send an email here too
    console.log(`[EMAIL SIMULATION] Sending invite to ${params.email} with link ${inviteLink}`);

    return { 
      success: true, 
      data: {
        inviteLink,
        whatsappLink,
        email: params.email
      } 
    };
  } catch (error: any) {
    console.error("inviteDoctorAction error:", error);
    return { success: false, error: error?.message || 'Failed to send invitation' };
  }
}

export async function getInvitationAction(token: string) {
  try {
    const { data: invite, error } = await supabase
      .from('Invitations')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !invite) throw new Error('Invalid or expired invitation link');
    
    const now = new Date();
    const expiresAt = new Date(invite.expires_at);
    if (now > expiresAt) throw new Error('Invitation link has expired');

    return { success: true, data: invite };
  } catch (error: any) {
    console.error("getInvitationAction error:", error);
    return { success: false, error: error?.message || 'Failed to fetch invitation' };
  }
}

export async function completeOnboardingAction(params: {
  token: string;
  fullName: string;
  password: string;
  email: string;
  phone: string;
  specialization: string;
  documents: string[];
  avatarUrl?: string;
  languages?: string[];
  hasAmericanBoard?: boolean;
}) {
  try {
    // 1. Verify token again
    const inviteVerify = await getInvitationAction(params.token);
    if (!inviteVerify.success) throw new Error('Security check failed');

    // 2. Create the Auth User (using the RPC we already have for staff creation)
    // This RPC creates the user in Auth and the User table record
    const result = await createDoctorServer({
      p_email: params.email,
      p_password: params.password,
      p_name: params.fullName,
      p_role: 'DOCTOR'
    });

    if (!result.success) throw new Error(result.error);

    // 3. Update the User record with specialization and status
    const { error: updateError } = await supabase
      .from('User')
      .update({
        specialization: params.specialization,
        phone: params.phone,
        status: 'approved', // Invitations mean pre-approval
        documents: params.documents
      })
      .eq('email', params.email);

    if (updateError) throw updateError;

    // 3.1 Update the DoctorProfile record with avatar, languages, and board status
    const { error: profileError } = await supabase
      .from('DoctorProfile')
      .update({
        avatarUrl: params.avatarUrl,
        academicInfo: {
          languages: params.languages || ['Arabic', 'English'],
          hasAmericanBoard: params.hasAmericanBoard || false,
        },
        // Also update top level columns if we added them
        languages: params.languages || ['Arabic', 'English'],
        has_american_board: params.hasAmericanBoard || false,
      })
      .eq('userId', result.data.id || result.data.user_id); // The RPC should return user id

    // Note: If DoctorProfile doesn't exist yet, it will be created by the app or trigger
    // But we try to update it here for immediate sync.

    // 4. (Optional) Delete the invitation so it can't be reused
    await supabase.from('Invitations').delete().eq('token', params.token);

    return { success: true };
  } catch (error: any) {
    console.error("completeOnboardingAction error:", error);
    return { success: false, error: error?.message || 'Onboarding failed' };
  }
}

export async function banDoctorAction(userId: string) {
  try {
    const { error } = await supabase
      .from('User')
      .update({ status: 'SUSPENDED' })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("banDoctorAction error:", error);
    return { success: false, error: error?.message || 'Failed to ban doctor' };
  }
}

export async function unbanDoctorAction(userId: string) {
  try {
    const { error } = await supabase
      .from('User')
      .update({ status: 'APPROVED' })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("unbanDoctorAction error:", error);
    return { success: false, error: error?.message || 'Failed to unban doctor' };
  }
}

export async function deleteDoctorAction(userId: string) {
  try {
    // 1. Delete profile first if exists (foreign key constraint might exist)
    await supabase.from('DoctorProfile').delete().eq('userId', userId);
    
    // 2. Delete user
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("deleteDoctorAction error:", error);
    return { success: false, error: error?.message || 'Failed to delete doctor' };
  }
}

export async function updateDoctorAction(userId: string, data: any) {
  try {
    const { error } = await supabase
      .from('User')
      .update(data)
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("updateDoctorAction error:", error);
    return { success: false, error: error?.message || 'Failed to update doctor' };
  }
}
