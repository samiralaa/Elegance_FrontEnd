import{_ as ee,y as c,L as F,E as te,r as i,a4 as oe,o as m,c as k,a as t,t as n,e as l,p as r,w as ae,k as I,f as V,b as u,U as p,G as _,a8 as le,F as z,d as B,m as f,a9 as re,aa as ne,Z as se,ab as de,ac as ie}from"./index-ee436be5.js";const ce={class:"orders-page"},ue={class:"orders-header"},pe={class:"orders-filters"},me={class:"",id:"invoice-print",dir:"ltr"},fe={class:"card p-4"},he={class:"d-flex justify-content-between align-items-center designInIframe"},ge=["src"],_e={class:"row mb-4"},ve={class:"col-md-6"},be={class:"mb-0"},we={class:"mb-0"},ye={class:"mb-0"},ke={class:"col-md-6 text-end"},$e={class:"mb-0"},De={class:"mb-0"},Ce={class:"table table-hover table-bordered"},Oe={class:"text-end"},Se={class:"text-end"},$=5,Ee={__name:"Orders",setup(xe){const D=c([]),v=c(""),b=c(""),C=c(1),O=c(!1),d=c(null),S=c(!1),A=c("assets/logo.png"),L=["all","pending","accepted","completed","cancelled"],w=async()=>{S.value=!0;try{const o=JSON.parse(localStorage.getItem("tokenData"));if(!o||!o.token)throw new Error("Authentication token not found");u.defaults.headers.common.Authorization=`Bearer ${o.token}`;const e=await u.get("https://backend.webenia.org/api/orders");if(e.data.status===!0)D.value=e.data.data,console.log("Fetched Orders:",D.value);else throw new Error(e.data.message||"Failed to fetch orders")}catch(o){console.error("Error fetching orders:",o),p.error("Failed to fetch orders")}finally{S.value=!1}},E=F(()=>D.value.filter(o=>{const e=v.value===""||o.id.toString().includes(v.value.toLowerCase())||o.total_price.includes(v.value.toLowerCase()),s=!b.value||o.status===b.value;return b.value==="all"?e:e&&s})),N=F(()=>{const o=(C.value-1)*$,e=o+$;return E.value.slice(o,e)}),T=o=>{C.value=o},U=o=>{d.value=o,O.value=!0,console.log("Selected Order:",d.value)},j=async o=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");u.defaults.headers.common.Authorization=`Bearer ${e.token}`;const s=await u.get(`https://backend.webenia.org/api/orders/${o.id}/accept`);if(s.data.status===!0)p.success("Order accepted successfully"),await w();else throw new Error(s.data.message||"Failed to accept order")}catch{p.error("Failed to accept order")}},J=async o=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");u.defaults.headers.common.Authorization=`Bearer ${e.token}`;const s=await u.get(`https://backend.webenia.org/api/orders/${o.id}/complete`);if(s.data.status===!0)p.success("Order completed successfully"),await w();else throw new Error(s.data.message||"Failed to complete order")}catch(e){console.error("Error completing order:",e),p.error(e.message||"Failed to complete order")}},P=()=>{const o=document.getElementById("invoice-print"),e=document.createElement("iframe");e.style.position="fixed",e.style.right="0",e.style.bottom="0",e.style.width="0",e.style.height="0",e.style.border="0",document.body.appendChild(e);const s=e.contentWindow.document,x=`
    <style>
      /* Example styles — replace/add your own as needed */
      body {
        font-family: Arial, sans-serif;
        // padding: 20px;
        color: #000;
      }
      .text-end { text-align: right; }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #ccc;
         padding: 8px;
      }
      .header, .footer {
        // margin-bottom: 20px;
      }
        .designInIframe{
        display: flex;
        justify-content: space-between;
        align-items: center;
        }
        .row {
        display: flex;
        justify-content: space-between;
        align-items: start;
       
        }
        p{
        margin: 10px;
        
        }
        span{
        font-weight: bold;
        }
        h6{
        margin: 20px 0;
        }
       
    </style>
  `;s.open(),s.write(`
    <html>
      <head>
        <title>Invoice</title>
        ${x}
      </head>
      <body>
        ${o.innerHTML}
      </body>
    </html>
  `),s.close(),e.contentWindow.focus(),e.contentWindow.print()},M=o=>{const e=new Date(o);return e.toLocaleDateString()+" "+e.toLocaleTimeString()},W=o=>({pending:"warning",completed:"info",cancelled:"danger",accepted:"success"})[o.toLowerCase()]||"info",Q=async o=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");u.defaults.headers.common.Authorization=`Bearer ${e.token}`;const s=await u.post(`https://backend.webenia.org/api/orders/${o.id}/cancel`);if(s.data.status===!0)p.success("Order cancelled successfully"),await w();else throw new Error(s.data.message||"Failed to cancel order")}catch(e){console.error("Error cancelling order:",e),p.error(e.message||"Failed to cancel order")}},q=o=>{p.info("Reordered items from order #"+o.id)};return te(()=>{w()}),(o,e)=>{const s=i("el-icon"),x=i("el-input"),G=i("el-option"),H=i("el-select"),h=i("el-table-column"),R=i("el-tag"),g=i("el-button"),Z=i("el-table"),K=i("el-pagination"),X=i("el-dialog"),Y=oe("loading");return m(),k("div",ce,[t("div",ue,[t("h2",null,n(o.$t("orders.myOrders")),1),l(x,{modelValue:v.value,"onUpdate:modelValue":e[0]||(e[0]=a=>v.value=a),placeholder:o.$t("orders.Search-orders"),class:"search-input",clearable:""},{prefix:r(()=>[l(s,null,{default:r(()=>[l(_(le))]),_:1})]),_:1},8,["modelValue","placeholder"])]),t("div",pe,[l(H,{modelValue:b.value,"onUpdate:modelValue":e[1]||(e[1]=a=>b.value=a),placeholder:o.$t("orders.Filter-by-Status"),clearable:""},{default:r(()=>[(m(),k(z,null,B(L,a=>l(G,{key:a,label:a,value:a},null,8,["label","value"])),64))]),_:1},8,["modelValue","placeholder"])]),ae((m(),I(Z,{data:N.value,id:"orders-table",style:{width:"100%"},class:"orders-table",stripe:"",border:""},{default:r(()=>[l(h,{prop:"id",label:o.$t("orders.orderId"),width:"120"},null,8,["label"]),l(h,{prop:"ordered_at",label:o.$t("orders.orderDate"),width:"180"},{default:r(a=>[f(n(M(a.row.ordered_at)),1)]),_:1},8,["label"]),l(h,{label:o.$t("orders.total"),width:"150"},{default:r(a=>[f(n(a.row.currency)+" "+n(a.row.total_price),1)]),_:1},8,["label"]),l(h,{prop:"status",label:o.$t("orders.status"),width:"150"},{default:r(a=>[l(R,{type:W(a.row.status)},{default:r(()=>[f(n(a.row.status),1)]),_:2},1032,["type"])]),_:1},8,["label"]),l(h,{prop:"method",label:o.$t("orders.payment-method"),width:"150"},{default:r(a=>[f(n(a.row.payment_method),1)]),_:1},8,["label"]),l(h,{label:o.$t("orders.actions"),width:"220"},{default:r(a=>[l(g,{size:"small",type:"primary",onClick:y=>U(a.row),circle:""},{default:r(()=>[l(s,null,{default:r(()=>[l(_(re))]),_:1})]),_:2},1032,["onClick"]),l(g,{size:"small",type:"danger",disabled:a.row.status!=="pending"&&a.row.status!=="processing",onClick:y=>Q(a.row),circle:""},{default:r(()=>[l(s,null,{default:r(()=>[l(_(ne))]),_:1})]),_:2},1032,["disabled","onClick"]),l(g,{size:"small",type:"warning",onClick:y=>q(a.row),circle:""},{default:r(()=>[l(s,null,{default:r(()=>[l(_(se))]),_:1})]),_:2},1032,["onClick"]),l(g,{size:"small",type:"success",onClick:y=>j(a.row),disabled:a.row.status!=="pending",circle:""},{default:r(()=>[l(s,null,{default:r(()=>[l(_(de))]),_:1})]),_:2},1032,["onClick","disabled"]),l(g,{size:"small",type:"info",onClick:y=>J(a.row),disabled:a.row.status!=="accepted",circle:""},{default:r(()=>[l(s,null,{default:r(()=>[l(_(ie))]),_:1})]),_:2},1032,["onClick","disabled"])]),_:1},8,["label"])]),_:1},8,["data"])),[[Y,S.value]]),E.value.length>$?(m(),I(K,{key:0,class:"pagination",layout:"prev, pager, next","current-page":C.value,"page-size":$,total:E.value.length,onCurrentChange:T},null,8,["current-page","total"])):V("",!0),l(X,{modelValue:O.value,"onUpdate:modelValue":e[2]||(e[2]=a=>O.value=a),id:"order-details-dialog",title:o.$t("orders.orderDetails"),width:"600px"},{footer:r(()=>[d.value?(m(),I(g,{key:0,type:"primary",onClick:P},{default:r(()=>[f(n(o.$t("orders.printInvoice")||"Print Invoice"),1)]),_:1})):V("",!0)]),default:r(()=>[t("div",me,[t("div",fe,[t("div",he,[t("img",{src:A.value,class:"rounded object-fit-contain",width:"200",height:"100",alt:"hi"},null,8,ge),e[3]||(e[3]=t("div",null,[t("h5",null,"Elegance OUD"),t("p",{class:"mb-0"},"company's Country"),t("p",null,"Elegance@gmail.com")],-1))]),e[11]||(e[11]=t("hr",null,null,-1)),t("div",_e,[t("div",ve,[e[4]||(e[4]=t("h6",null,"Billed To:",-1)),t("p",be,n(d.value.user.name),1),t("p",we,n(d.value.address.country.name_en),1),t("p",ye,n(d.value.user.email),1),t("p",null,n(d.value.user.phone),1)]),t("div",ke,[e[7]||(e[7]=t("h6",null,"Invoice Details:",-1)),t("p",$e,[e[5]||(e[5]=t("span",{class:"fw-bold"},"Invoice ID :",-1)),f(" "+n(d.value.invoice_number),1)]),t("p",De,[e[6]||(e[6]=t("span",{class:"fw-bold"},"Order Date:",-1)),f(" "+n(d.value.ordered_at),1)])])]),t("table",Ce,[e[10]||(e[10]=t("thead",{class:"table-light"},[t("tr",null,[t("th",null,"#"),t("th",null,"Description"),t("th",null,"Unit Price"),t("th",null,"Quantity"),t("th",null,"Subtotal")])],-1)),t("tbody",null,[(m(!0),k(z,null,B(d.value.items,a=>(m(),k("tr",{key:a.id},[t("td",null,n(a.product_id),1),t("td",null,n(a.product.name_en),1),t("td",null,n(a.price)+" "+n(d.value.currency),1),t("td",null,n(a.quantity),1),t("td",null,n(a.subtotal),1)]))),128))]),t("tfoot",null,[t("tr",null,[e[8]||(e[8]=t("th",{colspan:"4",class:"text-end"},"Delivery",-1)),t("th",Oe,n(d.value.delivery_fee),1)]),t("tr",null,[e[9]||(e[9]=t("th",{colspan:"4",class:"text-end"},"Total",-1)),t("th",Se,n(d.value.currency)+" "+n(d.value.total_price),1)])])]),e[12]||(e[12]=t("p",{class:"mt-4 text-center fw-bold"},"Elegance happy to see you again",-1))])])]),_:1},8,["modelValue","title"])])}}},Fe=ee(Ee,[["__scopeId","data-v-23d2bd27"]]);export{Fe as default};
