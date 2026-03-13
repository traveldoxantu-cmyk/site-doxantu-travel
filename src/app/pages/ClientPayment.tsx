import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, Download, CreditCard, Smartphone, ChevronRight } from 'lucide-react';

import waveLogo from '../../assets/wave.png';
import orangeMoneyLogo from '../../assets/orange-money.png';
import visaLogo from '../../assets/visa.png';

const paymentMethods = [
  { id: 'wave', name: 'Wave', iconUrl: waveLogo, color: '#1B81FB', bg: '#EFF6FF', type: 'mobile' },
  { id: 'orange', name: 'Orange Money', iconUrl: orangeMoneyLogo, color: '#FF7900', bg: '#FFF5EB', type: 'mobile' },
  { id: 'card', name: 'Carte Bancaire', iconUrl: visaLogo, color: '#0B84D8', bg: '#E8F4FD', type: 'card' }
];

export function ClientPayment() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
  
  // Simulation facture
  const invoice = {
    id: 'FCT-2026-089',
    description: 'Frais de dossier Campus France',
    amount: 150000,
    date: '12 Mars 2026',
    status: 'pending'
  };

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);

  // Simulation du processing de paiement
  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 3500); // Faux délai de 3.5s
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b40] mb-1">Règlement de facture</h1>
          <p className="text-gray-500">Sécurisé par PayDunya</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-100">
          <ShieldCheck className="w-5 h-5" />
          Paiement 100% sécurisé
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche : Formulaire de paiement */}
        <div className="lg:col-span-2">
          {step === 'selection' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
              
              <div>
                <h2 className="text-lg font-bold text-[#1a2b40] mb-4">Moyen de paiement</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        selectedMethod === method.id 
                          ? 'border-[#0B84D8] ring-4 ring-[#0B84D8]/10 bg-[#F0F8FF]' 
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-[#0B84D8] rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="w-12 h-12 bg-white rounded-xl mb-3 flex items-center justify-center p-2 shadow-sm border border-gray-100">
                        <img src={method.iconUrl} alt={method.name} className="w-full h-full object-contain" />
                      </div>
                      <p className="font-bold text-[#1a2b40] text-sm">{method.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedMethod && (
                <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handlePay} className="pt-6 border-t border-gray-100">
                  {currentMethod?.type === 'mobile' ? (
                     <div>
                       <label className="block text-sm font-semibold text-[#1a2b40] mb-2 flex items-center gap-2">
                         <Smartphone className="w-4 h-4 text-gray-400" />
                         Numéro de téléphone {currentMethod.name}
                       </label>
                       <div className="flex">
                         <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 font-medium text-sm">
                           +221
                         </span>
                         <input 
                           type="tel" 
                           required 
                           placeholder="77 000 00 00" 
                           value={phoneNumber}
                           onChange={(e) => setPhoneNumber(e.target.value)}
                           className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:outline-none focus:border-[#0B84D8] focus:ring-1 focus:ring-[#0B84D8] font-medium"
                         />
                       </div>
                       <p className="text-xs text-gray-500 mt-2">Vous recevrez une notification sur votre téléphone pour valider le paiement.</p>
                     </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#1a2b40] mb-2 flex items-center gap-2">
                           <CreditCard className="w-4 h-4 text-gray-400" /> Numéro de carte
                        </label>
                        <input type="text" required placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B84D8] font-medium tracking-widest" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#1a2b40] mb-2">Expiration</label>
                          <input type="text" required placeholder="MM/AA" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B84D8] font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#1a2b40] mb-2">CVC</label>
                          <input type="text" required placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0B84D8] font-medium" />
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full mt-8 py-4 bg-[#0B84D8] hover:bg-[#0973BD] text-white rounded-xl font-bold flex justify-between items-center px-6 transition-colors shadow-lg shadow-[#0B84D8]/20"
                  >
                    <span>Payer {invoice.amount.toLocaleString()} FCFA</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.form>
              )}
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#0B84D8] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center p-5 bg-white rounded-full scale-75">
                  <img src={currentMethod?.iconUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#1a2b40] mb-2">En attente de confirmation</h2>
              <p className="text-gray-500 max-w-md">
                {currentMethod?.type === 'mobile' 
                  ? `Veuillez consulter votre application ${currentMethod.name} au +221 ${phoneNumber} pour valider le paiement par code secret.`
                  : "Traitement sécurisé de votre carte bancaire en cours avec votre banque..."}
              </p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-12 border border-emerald-100 shadow-[0_8px_30px_rgb(16,185,129,0.12)] text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-[#1a2b40] mb-2">Paiement Réussi !</h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Votre règlement de <strong>{invoice.amount.toLocaleString()} FCFA</strong> a bien été traité via {currentMethod?.name}.
              </p>
              
              <div className="bg-[#F8FAFC] rounded-2xl p-6 w-full max-w-sm mb-8 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Réf. Transaction</span>
                  <span className="font-bold text-[#1a2b40]">TRX-882910</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-bold text-[#1a2b40]">{new Date().toLocaleString('fr-FR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Facture</span>
                  <span className="font-bold text-[#0B84D8]">{invoice.id}</span>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-sm">
                <button onClick={() => window.location.href = '/mon-espace/dashboard'} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-[#1a2b40] rounded-xl font-bold transition-colors">
                  Retour au Dashboard
                </button>
                <button className="flex-1 py-3 bg-[#0B84D8] hover:bg-[#0973BD] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                  <Download className="w-4 h-4" /> Reçu
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Colonne Droite : Récapitulatif Facture */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a2b40] rounded-3xl p-6 text-white sticky top-24">
            <h3 className="font-bold text-lg mb-6 border-b border-white/10 pb-4">Résumé de la commande</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-400 text-xs mb-1">RÉFÉRENCE</p>
                <p className="font-medium">{invoice.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">DESCRIPTION</p>
                <p className="font-medium leading-tight">{invoice.description}</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-gray-300">Total à payer</span>
                <span className="text-2xl font-bold text-[#7dd3fc]">{invoice.amount.toLocaleString()} <span className="text-sm">FCFA</span></span>
              </div>
              <p className="text-xs text-center text-gray-400 mt-4 border-t border-white/10 pt-4">
                En procédant au paiement, vous acceptez nos <a href="#" className="underline">Conditions Générales de Vente</a>.
              </p>
            </div>
            
            <div className="flex justify-center gap-4 opacity-70">
              <img src={waveLogo} alt="Wave" className="h-6 w-auto object-contain brightness-0 invert" />
              <img src={orangeMoneyLogo} alt="Orange Money" className="h-6 w-auto object-contain brightness-0 invert" />
              <img src={visaLogo} alt="Visa" className="h-6 w-auto object-contain brightness-0 invert" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
