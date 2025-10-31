import { getAllArticles, getFeaturedArticle, getRecentArticles } from '@/data/articles'

export default async function TestArticlesPage() {
  try {
    const allArticles = await getAllArticles()
    const featuredArticle = await getFeaturedArticle()
    const recentArticles = await getRecentArticles(6)

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Teste de Artigos</h1>

        <div className="space-y-8">
          <div className="bg-green-100 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">✅ Status</h2>
            <p className="text-green-800">Sistema de artigos funcionando corretamente!</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">📊 Estatísticas</h2>
            <ul className="space-y-2">
              <li><strong>Total de artigos:</strong> {allArticles.length}</li>
              <li><strong>Artigo em destaque:</strong> {featuredArticle?.title || 'Nenhum'}</li>
              <li><strong>Artigos recentes:</strong> {recentArticles.length}</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">📝 Todos os Artigos</h2>
            <div className="grid gap-4">
              {allArticles.map((article) => (
                <div key={article.id} className="bg-white p-4 rounded border">
                  <h3 className="font-semibold text-lg">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Categoria: {article.category.name}</span>
                    <span>Data: {article.publishedAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      ID: {article.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Teste de Artigos</h1>
        <div className="bg-red-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">❌ Erro</h2>
          <p className="text-red-800">Erro ao carregar artigos: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
        </div>
      </div>
    )
  }
}