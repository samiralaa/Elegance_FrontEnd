import{_ as Z,y as c,L as V,E as ee,r as i,a5 as te,o as u,c as y,a as t,t as n,e as o,p as r,w as le,k as I,f as F,b as _,V as f,G as b,a9 as ae,F as z,d as B,m as p,aa as oe,ab as ne,$ as re,ac as se}from"./index-734559de.js";const de={class:"orders-page"},ie={class:"orders-header"},ce={class:"orders-filters"},ue={class:"",id:"invoice-print",dir:"ltr"},pe={class:"card p-4"},me={class:"d-flex justify-content-between align-items-center designInIframe"},_e=["src"],fe={class:"row mb-4"},he={class:"col-md-6"},ge={class:"mb-0"},ve={class:"mb-0"},be={class:"mb-0"},ye={class:"col-md-6 text-end"},we={class:"mb-0"},ke={class:"mb-0"},$e={class:"table table-hover table-bordered"},De={class:"text-end"},Ce={class:"text-end"},w=5,Oe={__name:"Orders",setup(Se){const k=c([]),h=c(""),g=c(""),$=c(1),D=c(!1),d=c(null),C=c(!1),L=c("assets/logo.png"),A=["all","pending","accepted","completed","cancelled"],O=async()=>{C.value=!0;try{const l=JSON.parse(localStorage.getItem("tokenData"));if(!l||!l.token)throw new Error("Authentication token not found");_.defaults.headers.common.Authorization=`Bearer ${l.token}`;const e=await _.get("https://backend.webenia.org/api/orders");if(e.data.status===!0)k.value=e.data.data,console.log("Fetched Orders:",k.value);else throw new Error(e.data.message||"Failed to fetch orders")}catch(l){console.error("Error fetching orders:",l),f.error("Failed to fetch orders")}finally{C.value=!1}},S=V(()=>k.value.filter(l=>{const e=h.value===""||l.id.toString().includes(h.value.toLowerCase())||l.total_price.includes(h.value.toLowerCase()),s=!g.value||l.status===g.value;return g.value==="all"?e:e&&s})),N=V(()=>{const l=($.value-1)*w,e=l+w;return S.value.slice(l,e)}),T=l=>{$.value=l},U=l=>{d.value=l,D.value=!0,console.log("Selected Order:",d.value)},j=async l=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");_.defaults.headers.common.Authorization=`Bearer ${e.token}`;const s=await _.get(`https://backend.webenia.org/api/orders/${l.id}/accept`);if(s.data.status===!0)f.success("Order accepted successfully"),await O();else throw new Error(s.data.message||"Failed to accept order")}catch{f.error("Failed to accept order")}},P=()=>{const l=document.getElementById("invoice-print"),e=document.createElement("iframe");e.style.position="fixed",e.style.right="0",e.style.bottom="0",e.style.width="0",e.style.height="0",e.style.border="0",document.body.appendChild(e);const s=e.contentWindow.document,x=`
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
        ${l.innerHTML}
      </body>
    </html>
  `),s.close(),e.contentWindow.focus(),e.contentWindow.print()},J=l=>{const e=new Date(l);return e.toLocaleDateString()+" "+e.toLocaleTimeString()},M=l=>({pending:"warning",completed:"info",cancelled:"danger",accepted:"success"})[l.toLowerCase()]||"info",W=async l=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");_.defaults.headers.common.Authorization=`Bearer ${e.token}`;const s=await _.post(`https://backend.webenia.org/api/orders/${l.id}/cancel`);if(s.data.status===!0)f.success("Order cancelled successfully"),await O();else throw new Error(s.data.message||"Failed to cancel order")}catch(e){console.error("Error cancelling order:",e),f.error(e.message||"Failed to cancel order")}},Q=l=>{f.info("Reordered items from order #"+l.id)};return ee(()=>{O()}),(l,e)=>{const s=i("el-icon"),x=i("el-input"),q=i("el-option"),G=i("el-select"),m=i("el-table-column"),H=i("el-tag"),v=i("el-button"),R=i("el-table"),K=i("el-pagination"),X=i("el-dialog"),Y=te("loading");return u(),y("div",de,[t("div",ie,[t("h2",null,n(l.$t("orders.myOrders")),1),o(x,{modelValue:h.value,"onUpdate:modelValue":e[0]||(e[0]=a=>h.value=a),placeholder:l.$t("orders.Search-orders"),class:"search-input",clearable:""},{prefix:r(()=>[o(s,null,{default:r(()=>[o(b(ae))]),_:1})]),_:1},8,["modelValue","placeholder"])]),t("div",ce,[o(G,{modelValue:g.value,"onUpdate:modelValue":e[1]||(e[1]=a=>g.value=a),placeholder:l.$t("orders.Filter-by-Status"),clearable:""},{default:r(()=>[(u(),y(z,null,B(A,a=>o(q,{key:a,label:a,value:a},null,8,["label","value"])),64))]),_:1},8,["modelValue","placeholder"])]),le((u(),I(R,{data:N.value,id:"orders-table",style:{width:"100%"},class:"orders-table",stripe:"",border:""},{default:r(()=>[o(m,{prop:"id",label:l.$t("orders.orderId"),width:"120"},null,8,["label"]),o(m,{prop:"ordered_at",label:l.$t("orders.orderDate"),width:"180"},{default:r(a=>[p(n(J(a.row.ordered_at)),1)]),_:1},8,["label"]),o(m,{label:l.$t("orders.total"),width:"150"},{default:r(a=>[p(n(a.row.currency)+" "+n(a.row.total_price),1)]),_:1},8,["label"]),o(m,{prop:"status",label:l.$t("orders.status"),width:"150"},{default:r(a=>[o(H,{type:M(a.row.status)},{default:r(()=>[p(n(a.row.status),1)]),_:2},1032,["type"])]),_:1},8,["label"]),o(m,{prop:"method",label:l.$t("orders.payment-method"),width:"150"},{default:r(a=>[p(n(a.row.payment_method),1)]),_:1},8,["label"]),o(m,{label:l.$t("orders.actions"),width:"220"},{default:r(a=>[o(v,{size:"small",type:"primary",onClick:E=>U(a.row),circle:""},{default:r(()=>[o(s,null,{default:r(()=>[o(b(oe))]),_:1})]),_:2},1032,["onClick"]),o(v,{size:"small",type:"danger",disabled:a.row.status!=="pending"&&a.row.status!=="processing",onClick:E=>W(a.row),circle:""},{default:r(()=>[o(s,null,{default:r(()=>[o(b(ne))]),_:1})]),_:2},1032,["disabled","onClick"]),o(v,{size:"small",type:"warning",onClick:E=>Q(a.row),circle:""},{default:r(()=>[o(s,null,{default:r(()=>[o(b(re))]),_:1})]),_:2},1032,["onClick"]),o(v,{size:"small",type:"success",onClick:E=>j(a.row),disabled:a.row.status!=="pending",circle:""},{default:r(()=>[o(s,null,{default:r(()=>[o(b(se))]),_:1})]),_:2},1032,["onClick","disabled"])]),_:1},8,["label"])]),_:1},8,["data"])),[[Y,C.value]]),S.value.length>w?(u(),I(K,{key:0,class:"pagination",layout:"prev, pager, next","current-page":$.value,"page-size":w,total:S.value.length,onCurrentChange:T},null,8,["current-page","total"])):F("",!0),o(X,{modelValue:D.value,"onUpdate:modelValue":e[2]||(e[2]=a=>D.value=a),id:"order-details-dialog",title:l.$t("orders.orderDetails"),width:"600px"},{footer:r(()=>[d.value?(u(),I(v,{key:0,type:"primary",onClick:P},{default:r(()=>[p(n(l.$t("orders.printInvoice")||"Print Invoice"),1)]),_:1})):F("",!0)]),default:r(()=>[t("div",ue,[t("div",pe,[t("div",me,[t("img",{src:L.value,class:"rounded object-fit-contain",width:"200",height:"100",alt:"hi"},null,8,_e),e[3]||(e[3]=t("div",null,[t("h5",null,"Elegance OUD"),t("p",{class:"mb-0"},"company's Country"),t("p",null,"Elegance@gmail.com")],-1))]),e[11]||(e[11]=t("hr",null,null,-1)),t("div",fe,[t("div",he,[e[4]||(e[4]=t("h6",null,"Billed To:",-1)),t("p",ge,n(d.value.user.name),1),t("p",ve,n(d.value.address.country.name_en),1),t("p",be,n(d.value.user.email),1),t("p",null,n(d.value.user.phone),1)]),t("div",ye,[e[7]||(e[7]=t("h6",null,"Invoice Details:",-1)),t("p",we,[e[5]||(e[5]=t("span",{class:"fw-bold"},"Invoice ID :",-1)),p(" "+n(d.value.invoice_number),1)]),t("p",ke,[e[6]||(e[6]=t("span",{class:"fw-bold"},"Order Date:",-1)),p(" "+n(d.value.ordered_at),1)])])]),t("table",$e,[e[10]||(e[10]=t("thead",{class:"table-light"},[t("tr",null,[t("th",null,"#"),t("th",null,"Description"),t("th",null,"Unit Price"),t("th",null,"Quantity"),t("th",null,"Subtotal")])],-1)),t("tbody",null,[(u(!0),y(z,null,B(d.value.items,a=>(u(),y("tr",{key:a.id},[t("td",null,n(a.product_id),1),t("td",null,n(a.product.name_en),1),t("td",null,n(a.price)+" "+n(d.value.currency),1),t("td",null,n(a.quantity),1),t("td",null,n(a.subtotal),1)]))),128))]),t("tfoot",null,[t("tr",null,[e[8]||(e[8]=t("th",{colspan:"4",class:"text-end"},"Delivery",-1)),t("th",De,n(d.value.delivery_fee),1)]),t("tr",null,[e[9]||(e[9]=t("th",{colspan:"4",class:"text-end"},"Total",-1)),t("th",Ce,n(d.value.currency)+" "+n(d.value.total_price),1)])])]),e[12]||(e[12]=t("p",{class:"mt-4 text-center fw-bold"},"Elegance happy to see you again",-1))])])]),_:1},8,["modelValue","title"])])}}},Ee=Z(Oe,[["__scopeId","data-v-057927b2"]]);export{Ee as default};
