import { NextResponse } from 'next/server'

export const runtime = 'edge'

interface HGFinanceResponse {
    by: string
    valid_key: boolean
    results: {
        currencies: {
            [key: string]: {
                name: string
                buy: number
                sell: number
                variation: number
            }
        }
        bitcoin: {
            blockchain_info: {
                name: string
                format: string
                last: number
                buy: number
                sell: number
                variation: number
            }
            coinbase: {
                name: string
                format: string
                last: number
                variation: number
            }
            bitstamp: {
                name: string
                format: string
                last: number
                buy: number
                sell: number
                variation: number
            }
            foxbit: {
                name: string
                format: string
                last: number
                variation: number
            }
            mercadobitcoin: {
                name: string
                format: string
                last: number
                buy: number
                sell: number
                variation: number
            }
        }
    }
    execution_time: number
    from_cache: boolean
}

export async function GET() {
    try {
        const apiKey = process.env.HG_FINANCE_API_KEY

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key não configurada' },
                { status: 500 }
            )
        }

        const response = await fetch(
            `https://api.hgbrasil.com/finance?format=json&key=${apiKey}`,
            {
                next: { revalidate: 60 } // Cache por 60 segundos
            }
        )

        if (!response.ok) {
            throw new Error('Falha ao buscar dados da API')
        }

        const data: HGFinanceResponse = await response.json()

        if (!data.valid_key) {
            return NextResponse.json(
                { error: 'Chave de API inválida' },
                { status: 401 }
            )
        }

        // Formatar dados para o formato esperado pelo componente
        const cryptoPrices = []

        // Bitcoin
        if (data.results.bitcoin?.mercadobitcoin) {
            cryptoPrices.push({
                id: 'bitcoin',
                symbol: 'BTC',
                name: 'Bitcoin',
                current_price: data.results.bitcoin.mercadobitcoin.last,
                price_change_percentage_24h: data.results.bitcoin.mercadobitcoin.variation
            })
        }

        // Outras criptomoedas disponíveis na API
        const cryptoMap: { [key: string]: string } = {
            'ETH': 'Ethereum',
            'LTC': 'Litecoin',
            'XRP': 'Ripple',
            'BCH': 'Bitcoin Cash',
            'ADA': 'Cardano',
            'DOT': 'Polkadot',
            'LINK': 'Chainlink',
            'BNB': 'Binance Coin',
            'DOGE': 'Dogecoin',
            'USDT': 'Tether'
        }

        // Adicionar outras criptomoedas se disponíveis
        Object.entries(cryptoMap).forEach(([symbol, name]) => {
            if (data.results.currencies[symbol]) {
                cryptoPrices.push({
                    id: symbol.toLowerCase(),
                    symbol: symbol,
                    name: name,
                    current_price: data.results.currencies[symbol].buy || data.results.currencies[symbol].sell || 0,
                    price_change_percentage_24h: data.results.currencies[symbol].variation || 0
                })
            }
        })

        return NextResponse.json(cryptoPrices, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
        })
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Erro ao buscar preços:', error)
        }
        return NextResponse.json(
            { error: 'Erro ao buscar cotações' },
            { status: 500 }
        )
    }
}
