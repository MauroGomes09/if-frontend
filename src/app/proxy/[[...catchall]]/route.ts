import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';

// 1. URL DA SUA API (sem a barra no final)
const API_URL = process.env.API_URL;

// 2. Função Proxy
async function handler(req: NextRequest) {
  try {
    
    const requestPath = req.nextUrl.pathname;

    // --- INÍCIO DA CORREÇÃO ---
    // Remove o prefixo /proxy
    let apiSubPath = requestPath.startsWith('/proxy') ? requestPath.substring(6) : '/';

    // GARANTIA: Se o sub-caminho for uma string vazia (caso de /proxy), 
    // ele DEVE ser "/"
    if (apiSubPath === "" || !apiSubPath.startsWith('/')) {
      apiSubPath = `/${apiSubPath}`;
    }
    // --- FIM DA CORREÇÃO ---

    // 4. Constrói URL de destino correta
    const destinationUrl = `${API_URL}${apiSubPath}${req.nextUrl.search}`;
    console.log(`Proxying ${requestPath} to: ${destinationUrl}`); // <-- Verifique o log

    const headers: HeadersInit = {
    'Content-Type': 'application/json', // Default
    };

    let requestBody: BodyInit | null | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    try {
        const jsonBody = await req.json();
        requestBody = JSON.stringify(jsonBody);
    } catch (e) {
        requestBody = await req.text();
        headers['Content-Type'] = req.headers.get('Content-Type') || 'text/plain';
    }
}

const response = await fetch(destinationUrl, {
  method: req.method,
  headers: headers, 
  body: requestBody, 
  //@ts-ignore 
  duplex: 'half', 
});

    // 6. Pega a resposta
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("API returned invalid JSON despite content-type:", await response.text());
        data = { error: "Invalid JSON response from API" };
      }
    } else {
      data = await response.text();
      console.log("API did not return JSON. Body:", data.substring(0, 200)); 
    }

    // 7. Devolve a resposta
    // Precisamos criar uma nova resposta para repassar os headers (como content-type)
    const nextResponse = NextResponse.json(data, { 
      status: response.status,
      statusText: response.statusText,
    });
    
    // Copia headers da resposta da API para a resposta do Next.js
    response.headers.forEach((value, key) => {
      if (key !== 'content-encoding' && key !== 'transfer-encoding') { // Evita headers problemáticos
         nextResponse.headers.set(key, value);
      }
    });

    return nextResponse;

  } catch (error: any) {
    console.error("Erro no proxy da API:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor do front-end.", error: error.message },
      { status: 500 }
    );
  }
}

// 8. Exporta para os métodos necessários
export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE };