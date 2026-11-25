import React, { useState } from 'react';
import { Check, CreditCard, Lock, ShieldCheck, X } from 'lucide-react';
import { MemberProfile, PaymentTransaction, SubscriptionPlan } from '../types/fitpro';

interface PricingCheckoutProps {
  plans: SubscriptionPlan[];
  profile: MemberProfile;
  payments: PaymentTransaction[];
  onActivatePlan: (plan: SubscriptionPlan, channel: 'Card' | 'Bank Transfer' | 'USSD') => void;
}

export const PricingCheckout: React.FC<PricingCheckoutProps> = ({
  plans,
  profile,
  payments,
  onActivatePlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [channel, setChannel] = useState<'Card' | 'Bank Transfer' | 'USSD'>('Card');
  const [processing, setProcessing] = useState(false);

  const handlePaystackConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setProcessing(true);
    window.setTimeout(() => {
      onActivatePlan(selectedPlan, channel);
      setProcessing(false);
      setSelectedPlan(null);
    }, 550);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#29312B]">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F7F9F6]">
            Membership Plans
          </h1>
          <p className="mt-1 text-sm text-[#A1AAA3]">
            Transparent NGN pricing powered by Paystack checkout. Cancel or switch anytime.
          </p>
        </div>
        <p className="text-xs text-[#A1AAA3]">
          Current tier:{' '}
          <span className="text-[#B8F34A] font-semibold">{profile.planName}</span>
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const isCurrent = profile.planName === plan.name;
          const isRecommended = plan.slug === 'monthly';

          return (
            <div
              key={plan.id}
              className={`rounded-[16px] border p-6 flex flex-col justify-between ${
                isRecommended
                  ? 'border-[#B8F34A] bg-[#151917]'
                  : 'border-[#29312B] bg-[#151917]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-2xl font-bold text-[#F7F9F6]">{plan.name}</h2>
                  {plan.savingsNote && (
                    <span className="text-[11px] font-medium text-[#B8F34A]">{plan.savingsNote}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#A1AAA3]">{plan.audienceLabel}</p>

                <div className="mt-5 pb-5 border-b border-[#29312B]">
                  <span className="font-mono-tabular text-3xl font-bold text-[#F7F9F6]">
                    ₦{plan.priceNgn.toLocaleString('en-NG')}
                  </span>
                  <span className="ml-2 text-xs text-[#A1AAA3]">{plan.billingLabel}</span>
                </div>

                <dl className="mt-5 space-y-3 text-xs">
                  <div>
                    <dt className="text-[#A1AAA3]">Programs</dt>
                    <dd className="text-[#F7F9F6] font-medium mt-0.5">{plan.limits.programs}</dd>
                  </div>
                  <div>
                    <dt className="text-[#A1AAA3]">Exercises</dt>
                    <dd className="text-[#F7F9F6] font-medium mt-0.5">{plan.limits.exercises}</dd>
                  </div>
                  <div>
                    <dt className="text-[#A1AAA3]">Analytics</dt>
                    <dd className="text-[#F7F9F6] font-medium mt-0.5">{plan.limits.analytics}</dd>
                  </div>
                  <div>
                    <dt className="text-[#A1AAA3]">Bookmarks</dt>
                    <dd className="text-[#F7F9F6] font-medium mt-0.5">{plan.limits.savedLimit}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 pt-4 border-t border-[#29312B]">
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-[10px] border border-[#48C774]/40 bg-[#0B0D0C] text-center text-xs font-semibold text-[#48C774] inline-flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Active Membership
                  </div>
                ) : plan.priceNgn === 0 ? (
                  <button
                    type="button"
                    onClick={() => onActivatePlan(plan, 'Card')}
                    className="w-full py-2.5 rounded-[10px] border border-[#29312B] text-xs font-semibold text-[#F7F9F6] hover:border-[#A1AAA3] cursor-pointer"
                  >
                    Switch to Free Starter
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className="w-full py-2.5 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-xs font-semibold hover:bg-[#c8f76c] cursor-pointer"
                  >
                    Subscribe with Paystack
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Payment History */}
      <div className="rounded-[16px] border border-[#29312B] bg-[#151917] p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#F7F9F6]">Payment Verification Ledger</h2>
            <p className="text-xs text-[#A1AAA3]">Recent Paystack references and verification statuses</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#48C774]">
            <ShieldCheck className="w-4 h-4" />
            Server-side webhook simulation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#29312B] text-xs text-[#A1AAA3]">
                <th className="py-2.5 pr-4 font-medium">Reference</th>
                <th className="py-2.5 px-3 font-medium">Member</th>
                <th className="py-2.5 px-3 font-medium">Plan</th>
                <th className="py-2.5 px-3 font-medium">Channel</th>
                <th className="py-2.5 px-3 font-medium text-right">Amount</th>
                <th className="py-2.5 pl-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29312B]/70 text-sm">
              {payments.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#1D231F]/60">
                  <td className="py-3 pr-4 font-mono-tabular text-xs text-[#F7F9F6]">{tx.reference}</td>
                  <td className="py-3 px-3 text-xs text-[#A1AAA3]">{tx.memberName}</td>
                  <td className="py-3 px-3 text-xs text-[#F7F9F6]">{tx.planName}</td>
                  <td className="py-3 px-3 text-xs text-[#A1AAA3]">{tx.channel}</td>
                  <td className="py-3 px-3 text-right font-mono-tabular text-xs text-[#F7F9F6]">
                    ₦{tx.amountNgn.toLocaleString('en-NG')}
                  </td>
                  <td className="py-3 pl-3 text-right text-xs font-medium">
                    <span
                      className={
                        tx.status === 'success'
                          ? 'text-[#48C774]'
                          : tx.status === 'pending'
                          ? 'text-[#B8F34A]'
                          : 'text-[#F05C5C]'
                      }
                    >
                      {tx.status === 'success' ? 'Verified' : tx.status === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paystack Checkout Modal */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="paystack-modal-title"
        >
          <form
            onSubmit={handlePaystackConfirm}
            className="w-full max-w-md rounded-[18px] border border-[#29312B] bg-[#151917] p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#29312B]">
              <div>
                <p className="text-xs font-medium text-[#B8F34A]">Paystack Checkout</p>
                <h2 id="paystack-modal-title" className="font-display text-2xl font-bold text-[#F7F9F6]">
                  {selectedPlan.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="w-9 h-9 rounded-[10px] border border-[#29312B] flex items-center justify-center text-[#A1AAA3] hover:text-[#F7F9F6] cursor-pointer"
                aria-label="Close checkout"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 rounded-[12px] border border-[#29312B] bg-[#0B0D0C] p-4 flex items-center justify-between">
              <div className="text-xs text-[#A1AAA3]">
                <p className="text-[#F7F9F6] font-medium">{profile.email}</p>
                <p className="mt-0.5">{selectedPlan.billingLabel}</p>
              </div>
              <p className="font-mono-tabular text-xl font-bold text-[#B8F34A]">
                ₦{selectedPlan.priceNgn.toLocaleString('en-NG')}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-medium text-[#A1AAA3] mb-2">Select Paystack Payment Channel</p>
              <div className="grid grid-cols-3 gap-2">
                {(['Card', 'Bank Transfer', 'USSD'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`py-2.5 px-2 rounded-[10px] border text-xs font-medium cursor-pointer ${
                      channel === ch
                        ? 'border-[#B8F34A] bg-[#1D231F] text-[#B8F34A]'
                        : 'border-[#29312B] bg-[#0B0D0C] text-[#A1AAA3]'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-[#A1AAA3]">
              <Lock className="w-3.5 h-3.5 text-[#48C774] shrink-0" />
              <span>Transaction reference verified idempotently before entitlement activation.</span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="mt-6 w-full py-3 rounded-[10px] bg-[#B8F34A] text-[#0B0D0C] text-sm font-semibold hover:bg-[#c8f76c] disabled:opacity-60 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              {processing
                ? 'Verifying Paystack Reference...'
                : `Pay ₦${selectedPlan.priceNgn.toLocaleString('en-NG')}`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
