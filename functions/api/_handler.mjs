// shared handler used by API endpoints
export default async function handler(request, env, route, originalRequest){
  const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if(request && request.method === 'OPTIONS') return new Response(null, {headers: CORS});
  const MOCK = env.MOCK_MODE === 'true' || !env.PROVIDER_API_URL;

  try{
    if(MOCK){
      // return simple mock data per route
      if(route==='packages'){
        return new Response(JSON.stringify({packages:[
          {id:'p1',name:'Paket Hemat 1GB',price:'Rp5.000',description:'1GB, 7 hari'},
          {id:'p2',name:'Paket Malam 3GB',price:'Rp8.000',description:'3GB untuk malam hari'},
        ]}),{headers:{...CORS,'Content-Type':'application/json'}});
      }
      if(route==='balance'){
        return new Response(JSON.stringify({balance:'Rp 12.345'}),{headers:{...CORS,'Content-Type':'application/json'}});
      }
      if(route==='buy'){
        const body = originalRequest ? await originalRequest.json() : {};
        return new Response(JSON.stringify({success:true,order_id:'MOCK-'+Date.now(),message:`Pembelian ${body.package_id} untuk ${body.phone} berhasil (mock)`}),{headers:{...CORS,'Content-Type':'application/json'}});
      }
      if(route==='history'){
        return new Response(JSON.stringify({history:[{order_id:'MOCK-1',package_id:'p1',status:'success'},{order_id:'MOCK-2',package_id:'p2',status:'pending'}]}),{headers:{...CORS,'Content-Type':'application/json'}});
      }
      if(route==='auth'){
        return new Response(JSON.stringify({ok:true,user:'mock-user'}),{headers:{...CORS,'Content-Type':'application/json'}});
      }
    }

    // Proxy mode: forward request to provider API
    const base = env.PROVIDER_API_URL.replace(/\/$/,'');
    let proxyPath = '/';
    if(route==='packages') proxyPath = '/packages';
    if(route==='balance') proxyPath = '/balance';
    if(route==='buy') proxyPath = '/buy';
    if(route==='history') proxyPath = '/history';
    if(route==='auth') proxyPath = '/auth';

    const url = base + proxyPath;
    const headers = { 'Accept':'application/json' };
    if(env.PROVIDER_API_KEY) headers['Authorization'] = 'Bearer '+env.PROVIDER_API_KEY;

    const init = { method: (originalRequest && originalRequest.method) || 'GET', headers };
    if(originalRequest && originalRequest.method && originalRequest.method.toUpperCase()==='POST'){
      init.body = await originalRequest.text();
      // preserve content-type if provided
      const ct = (await originalRequest.headers.get('content-type')) || 'application/json';
      init.headers['Content-Type'] = ct;
    }

    const resp = await fetch(url, init);
    const txt = await resp.text();
    const outHeaders = { ...CORS, 'Content-Type': resp.headers.get('Content-Type') || 'application/json' };
    return new Response(txt, { status: resp.status, headers: outHeaders });
  }catch(err){
    return new Response(JSON.stringify({error: String(err)}), {status:500, headers:{...CORS,'Content-Type':'application/json'}});
  }
}
