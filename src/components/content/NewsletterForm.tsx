'use client';

import { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validação básica no frontend
        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Por favor, insira um email válido.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Inscrição realizada com sucesso! Bem-vindo à comunidade A Cifra.');
                setEmail('');
                
                // Analytics (opcional)
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'newsletter_signup', {
                        event_category: 'engagement',
                        event_label: 'newsletter'
                    });
                }
            } else {
                setStatus('error');
                setMessage(data.error || 'Erro ao processar inscrição. Tente novamente.');
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            setStatus('error');
            setMessage('Erro de conexão. Verifique sua internet e tente novamente.');
        }
    };

    return (
        <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 backdrop-blur-sm text-[#D4AF37] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#D4AF37]/30">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
                Newsletter Exclusiva
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Não perca <span className="text-[#D4AF37]">nenhuma novidade</span>
            </h2>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Receba as principais notícias e análises do mercado crypto diretamente no seu email.
                <br />
                <span className="text-[#D4AF37] font-medium">Conteúdo exclusivo para assinantes.</span>
            </p>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu melhor email"
                        required
                        disabled={status === 'loading'}
                        className="flex-1 px-6 py-4 rounded-lg text-gray-900 bg-white/95 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-200 placeholder-gray-500 disabled:opacity-50"
                        aria-label="Email para newsletter"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="px-8 py-4 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0A1628] font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl"
                    >
                        {status === 'loading' ? 'Inscrevendo...' : 'Inscrever-se'}
                    </button>
                </div>

                {message && (
                    <div
                        className={`mt-4 p-4 rounded-lg ${status === 'success'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                            }`}
                    >
                        {message}
                    </div>
                )}
            </form>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Sem spam</span>
                </div>
                <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Cancelamento a qualquer momento</span>
                </div>
            </div>
        </div>
    );
}
