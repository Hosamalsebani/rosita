'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
  onClick?: () => void;
}

export function KPICard({ title, value, change, icon, color, subtitle, onClick }: KPICardProps) {
  const isPositive = change && change > 0;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      transition: 'all 0.3s ease',
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative',
      overflow: 'hidden',
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
    }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        top: -20, right: -20,
        width: 100, height: 100,
        borderRadius: '50%',
        background: `${color}10`,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `linear-gradient(135deg, ${color}18, ${color}08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>

        {change !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            background: isPositive ? '#ECFDF5' : '#FEF2F2',
            color: isPositive ? '#059669' : '#DC2626',
          }}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                       */
/* ------------------------------------------------------------------ */
interface StatusBadgeProps {
  status: string;
  labelAr?: string;
  labelEn?: string;
}

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  active: { bg: '#EFF6FF', color: '#2563EB', dot: '#2563EB' },
  pending: { bg: '#FFFBEB', color: '#D97706', dot: '#F59E0B' },
  completed: { bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
  cancelled: { bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
  preparing: { bg: '#F0F9FF', color: '#0284C7', dot: '#0EA5E9' },
  delivered: { bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
  new: { bg: '#F5F3FF', color: '#7C3AED', dot: '#8B5CF6' },
  APPROVED: { bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
  SUSPENDED: { bg: '#FFF7ED', color: '#D97706', dot: '#F59E0B' },
};

export function StatusBadge({ status, labelAr, labelEn }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.pending;
  const defaultLabels: Record<string, { ar: string; en: string }> = {
    active: { ar: 'نشط', en: 'Active' },
    pending: { ar: 'معلق', en: 'Pending' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    cancelled: { ar: 'ملغي', en: 'Cancelled' },
    preparing: { ar: 'قيد التحضير', en: 'Preparing' },
    delivered: { ar: 'تم التسليم', en: 'Delivered' },
    new: { ar: 'جديد', en: 'New' },
    APPROVED: { ar: 'معتمد', en: 'Approved' },
    SUSPENDED: { ar: 'محظور', en: 'Suspended' },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: style.bg,
      color: style.color,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: style.dot,
      }} />
      {labelAr || defaultLabels[status]?.ar || status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Data Table                                                         */
/* ------------------------------------------------------------------ */
interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  action?: ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({ columns, data, title, action }: DataTableProps<T>) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {(title || action) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #F1F5F9',
        }}>
          {title && <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{title}</h3>}
          {action}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {columns.map(col => (
                <th key={col.key} style={{
                  padding: '12px 24px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#64748B',
                  textAlign: 'start',
                  whiteSpace: 'nowrap',
                  width: col.width,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{
                borderBottom: i !== data.length - 1 ? '1px solid #F1F5F9' : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#FAFBFC'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {columns.map(col => (
                  <td key={col.key} style={{
                    padding: '16px 24px',
                    fontSize: 14,
                    color: '#334155',
                  }}>
                    {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick Action Button                                                */
/* ------------------------------------------------------------------ */
export function ActionButton({ children, variant = 'primary', onClick, icon, disabled }: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  const colors = {
    primary: { bg: 'linear-gradient(135deg, #2A7DE1, #1E60B8)', color: '#fff', shadow: '0 4px 14px rgba(42,125,225,0.3)' },
    secondary: { bg: '#F1F5F9', color: '#475569', shadow: 'none' },
    danger: { bg: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff', shadow: '0 4px 14px rgba(239,68,68,0.3)' },
  };
  const style = colors[variant];

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        borderRadius: 12,
        border: 'none',
        background: style.bg,
        color: style.color,
        boxShadow: style.shadow,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {icon}
      {children}
    </button>
  );
}
