import{_ as Z,y as u,L as z,E as ee,r as i,a5 as te,o as c,c as m,a as t,t as r,e as l,p as s,w as ae,k as V,f as w,b as p,U as h,G as y,a9 as oe,F as B,d as A,m as g,aa as le,ab as re,ac as se,ad as ne}from"./index-e7bcd114.js";const de={class:"orders-page"},ie={class:"orders-header"},ce={class:"orders-filters"},ue=["src"],pe=["src"],me=["src"],he={class:"",id:"invoice-print",dir:"ltr"},ge={class:"card p-4"},_e={class:"d-flex justify-content-between align-items-center designInIframe"},fe=["src"],be={class:"row mb-4"},ve={class:"col-md-6"},we={class:"mb-0"},ye={class:"mb-0"},ke={class:"mb-0"},De={class:"col-md-6 text-end"},$e={class:"mb-0"},Oe={class:"mb-0"},Se={class:"table table-hover table-bordered"},Ce={class:"text-end"},xe={class:"text-end"},$=5,Ee={__name:"Orders",setup(Ie){const O=u([]),f=u(""),b=u(""),S=u(1),C=u(!1),d=u(null),x=u(!1),k=u({elegance:"assets/logo.png",strappi:"assets/strappi.png",tabby:"assets/tabby.png",cash:"assets/cash.png"}),L=["all","pending","accepted","completed","cancelled"],D=async()=>{x.value=!0;try{const a=JSON.parse(localStorage.getItem("tokenData"));if(!a||!a.token)throw new Error("Authentication token not found");p.defaults.headers.common.Authorization=`Bearer ${a.token}`;const e=await p.get("https://backend.webenia.org/api/orders");if(e.data.status===!0)O.value=e.data.data,console.log("Fetched Orders:",O.value);else throw new Error(e.data.message||"Failed to fetch orders")}catch(a){console.error("Error fetching orders:",a),h.error("Failed to fetch orders")}finally{x.value=!1}},E=z(()=>O.value.filter(a=>{const e=f.value===""||a.id.toString().includes(f.value.toLowerCase())||a.total_price.includes(f.value.toLowerCase()),n=!b.value||a.status===b.value;return b.value==="all"?e:e&&n})),N=z(()=>{const a=(S.value-1)*$,e=a+$;return E.value.slice(a,e)}),T=a=>{S.value=a},U=a=>{d.value=a,C.value=!0,console.log("Selected Order:",d.value)},j=async a=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");p.defaults.headers.common.Authorization=`Bearer ${e.token}`;const n=await p.get(`https://backend.webenia.org/api/orders/${a.id}/accept`);if(n.data.status===!0)h.success("Order accepted successfully"),await D();else throw new Error(n.data.message||"Failed to accept order")}catch{h.error("Failed to accept order")}},J=async a=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");p.defaults.headers.common.Authorization=`Bearer ${e.token}`;const n=await p.get(`https://backend.webenia.org/api/orders/${a.id}/complete`);if(n.data.status===!0)h.success("Order completed successfully"),await D();else throw new Error(n.data.message||"Failed to complete order")}catch(e){console.error("Error completing order:",e),h.error(e.message||"Failed to complete order")}},P=()=>{const a=document.getElementById("invoice-print"),e=document.createElement("iframe");e.style.position="fixed",e.style.right="0",e.style.bottom="0",e.style.width="0",e.style.height="0",e.style.border="0",document.body.appendChild(e);const n=e.contentWindow.document,I=`
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
  `;n.open(),n.write(`
    <html>
      <head>
        <title>Invoice</title>
        ${I}
      </head>
      <body>
        ${a.innerHTML}
      </body>
    </html>
  `),n.close(),e.contentWindow.focus(),e.contentWindow.print()},M=a=>{const e=new Date(a);return e.toLocaleDateString()+" "+e.toLocaleTimeString()},W=a=>({pending:"warning",completed:"info",cancelled:"danger",accepted:"success"})[a.toLowerCase()]||"info",Q=async a=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");p.defaults.headers.common.Authorization=`Bearer ${e.token}`;const n=await p.post(`https://backend.webenia.org/api/orders/${a.id}/cancel`);if(n.data.status===!0)h.success("Order cancelled successfully"),await D();else throw new Error(n.data.message||"Failed to cancel order")}catch(e){console.error("Error cancelling order:",e),h.error(e.message||"Failed to cancel order")}};return ee(()=>{D()}),(a,e)=>{const n=i("el-icon"),I=i("el-input"),q=i("el-option"),G=i("el-select"),_=i("el-table-column"),H=i("el-tag"),v=i("el-button"),K=i("el-table"),R=i("el-pagination"),X=i("el-dialog"),Y=te("loading");return c(),m("div",de,[t("div",ie,[t("h2",null,r(a.$t("orders.myOrders")),1),l(I,{modelValue:f.value,"onUpdate:modelValue":e[0]||(e[0]=o=>f.value=o),placeholder:a.$t("orders.Search-orders"),class:"search-input",clearable:""},{prefix:s(()=>[l(n,null,{default:s(()=>[l(y(oe))]),_:1})]),_:1},8,["modelValue","placeholder"])]),t("div",ce,[l(G,{modelValue:b.value,"onUpdate:modelValue":e[1]||(e[1]=o=>b.value=o),placeholder:a.$t("orders.Filter-by-Status"),clearable:""},{default:s(()=>[(c(),m(B,null,A(L,o=>l(q,{key:o,label:o,value:o},null,8,["label","value"])),64))]),_:1},8,["modelValue","placeholder"])]),ae((c(),V(K,{data:N.value,id:"orders-table",style:{width:"100%"},class:"orders-table",stripe:"",border:""},{default:s(()=>[l(_,{prop:"id",label:a.$t("orders.orderId"),width:"120"},null,8,["label"]),l(_,{prop:"ordered_at",label:a.$t("orders.orderDate"),width:"180"},{default:s(o=>[g(r(M(o.row.ordered_at)),1)]),_:1},8,["label"]),l(_,{label:a.$t("orders.total"),width:"150"},{default:s(o=>[g(r(o.row.currency)+" "+r(o.row.total_price),1)]),_:1},8,["label"]),l(_,{prop:"status",label:a.$t("orders.status"),width:"150"},{default:s(o=>[l(H,{type:W(o.row.status)},{default:s(()=>[g(r(o.row.status),1)]),_:2},1032,["type"])]),_:1},8,["label"]),l(_,{prop:"method",label:a.$t("orders.payment-method"),width:"150"},{default:s(o=>[o.row.payment_method==="stripe"?(c(),m("img",{key:0,src:k.value.strappi,alt:"Strappi",width:"20",height:"20"},null,8,ue)):w("",!0),o.row.payment_method==="tabby"?(c(),m("img",{key:1,src:k.value.tabby,alt:"Tabby",width:"20",height:"20"},null,8,pe)):w("",!0),o.row.payment_method==="cod"?(c(),m("img",{key:2,src:k.value.cash,alt:"Cash",width:"20",height:"20"},null,8,me)):w("",!0),g(" "+r(o.row.payment_method),1)]),_:1},8,["label"]),l(_,{label:a.$t("orders.actions"),width:"220",fixed:"right"},{default:s(o=>[l(v,{size:"small",type:"primary",onClick:F=>U(o.row),circle:""},{default:s(()=>[l(n,null,{default:s(()=>[l(y(le))]),_:1})]),_:2},1032,["onClick"]),l(v,{size:"small",type:"danger",disabled:o.row.status!=="pending"&&o.row.status!=="processing",onClick:F=>Q(o.row),circle:""},{default:s(()=>[l(n,null,{default:s(()=>[l(y(re))]),_:1})]),_:2},1032,["disabled","onClick"]),l(v,{size:"small",type:"success",onClick:F=>j(o.row),disabled:o.row.status!=="pending",circle:""},{default:s(()=>[l(n,null,{default:s(()=>[l(y(se))]),_:1})]),_:2},1032,["onClick","disabled"]),l(v,{size:"small",type:"info",onClick:F=>J(o.row),disabled:o.row.status!=="accepted",circle:""},{default:s(()=>[l(n,null,{default:s(()=>[l(y(ne))]),_:1})]),_:2},1032,["onClick","disabled"])]),_:1},8,["label"])]),_:1},8,["data"])),[[Y,x.value]]),E.value.length>$?(c(),V(R,{key:0,class:"pagination",layout:"prev, pager, next","current-page":S.value,"page-size":$,total:E.value.length,onCurrentChange:T},null,8,["current-page","total"])):w("",!0),l(X,{modelValue:C.value,"onUpdate:modelValue":e[2]||(e[2]=o=>C.value=o),id:"order-details-dialog",title:a.$t("orders.orderDetails"),width:"600px"},{footer:s(()=>[d.value?(c(),V(v,{key:0,type:"primary",onClick:P},{default:s(()=>[g(r(a.$t("orders.printInvoice")||"Print Invoice"),1)]),_:1})):w("",!0)]),default:s(()=>[t("div",he,[t("div",ge,[t("div",_e,[t("img",{src:k.value.elegance,class:"rounded object-fit-contain",width:"200",height:"100",alt:"hi"},null,8,fe),e[3]||(e[3]=t("div",null,[t("h5",null,"Elegance OUD"),t("p",{class:"mb-0"},"00971544887138"),t("p",null,"eleganceoud22@gmail.com")],-1))]),e[11]||(e[11]=t("hr",null,null,-1)),t("div",be,[t("div",ve,[e[4]||(e[4]=t("h6",null,"Billed To:",-1)),t("p",we,r(d.value.user.name),1),t("p",ye,r(d.value.address.country.name_en),1),t("p",ke,r(d.value.user.email),1),t("p",null,r(d.value.user.phone),1)]),t("div",De,[e[7]||(e[7]=t("h6",null,"Invoice Details:",-1)),t("p",$e,[e[5]||(e[5]=t("span",{class:"fw-bold"},"Invoice ID :",-1)),g(" "+r(d.value.invoice_number),1)]),t("p",Oe,[e[6]||(e[6]=t("span",{class:"fw-bold"},"Order Date:",-1)),g(" "+r(d.value.ordered_at),1)])])]),t("table",Se,[e[10]||(e[10]=t("thead",{class:"table-light"},[t("tr",null,[t("th",null,"#"),t("th",null,"Description"),t("th",null,"Unit Price"),t("th",null,"Quantity"),t("th",null,"Subtotal")])],-1)),t("tbody",null,[(c(!0),m(B,null,A(d.value.items,o=>(c(),m("tr",{key:o.id},[t("td",null,r(o.product_id),1),t("td",null,r(o.product.name_en),1),t("td",null,r(o.price)+" "+r(d.value.currency),1),t("td",null,r(o.quantity),1),t("td",null,r(o.subtotal),1)]))),128))]),t("tfoot",null,[t("tr",null,[e[8]||(e[8]=t("th",{colspan:"4",class:"text-end"},"Delivery",-1)),t("th",Ce,r(d.value.delivery_fee),1)]),t("tr",null,[e[9]||(e[9]=t("th",{colspan:"4",class:"text-end"},"Total",-1)),t("th",xe,r(d.value.currency)+" "+r(d.value.total_price),1)])])]),e[12]||(e[12]=t("p",{class:"mt-4 text-center fw-bold"},"Elegance happy to see you again",-1))])])]),_:1},8,["modelValue","title"])])}}},Ve=Z(Ee,[["__scopeId","data-v-165f90e2"]]);export{Ve as default};
