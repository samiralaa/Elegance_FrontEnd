import{_ as Y,y as c,L as V,E as Z,r as i,a5 as ee,o as u,c as v,a as t,t as a,e as n,p as s,w as te,k as S,f as B,b as h,V as b,G as y,a9 as le,F,d as L,m as p,aa as oe,ab as ae,$ as ne}from"./index-7d302927.js";const se={class:"orders-page"},re={class:"orders-header"},de={class:"orders-filters"},ie={class:"",id:"invoice-print",dir:"ltr"},ce={class:"card p-4"},ue={class:"d-flex justify-content-between align-items-center designInIframe"},pe=["src"],me={class:"row mb-4"},_e={class:"col-md-6"},ge={class:"mb-0"},fe={class:"mb-0"},ve={class:"mb-0"},he={class:"col-md-6 text-end"},be={class:"mb-0"},ye={class:"mb-0"},we={class:"table table-hover table-bordered"},ke={class:"text-end"},xe={class:"text-end"},w=5,De={__name:"Orders",setup(Ce){const E=c([]),m=c(""),g=c(""),k=c(1),x=c(!1),r=c(null),D=c(!1),z=c("assets/logo.png"),N=["pending","processing","cancelled"],I=async()=>{D.value=!0;try{const l=JSON.parse(localStorage.getItem("tokenData"));if(!l||!l.token)throw new Error("Authentication token not found");h.defaults.headers.common.Authorization=`Bearer ${l.token}`;const e=await h.get("https://backend.webenia.org/api/orders");if(e.data.status===!0)E.value=e.data.data;else throw new Error(e.data.message||"Failed to fetch orders")}catch(l){console.error("Error fetching orders:",l),b.error(l.message||"Failed to fetch orders")}finally{D.value=!1}},C=V(()=>E.value.filter(l=>{const e=m.value===""||l.id.toString().includes(m.value.toLowerCase())||l.total_price.includes(m.value.toLowerCase()),d=!g.value||l.status===g.value;return e&&d})),T=V(()=>{const l=(k.value-1)*w,e=l+w;return C.value.slice(l,e)}),A=l=>{k.value=l},U=l=>{r.value=l,x.value=!0,console.log("Selected Order:",r.value)},j=()=>{const l=document.getElementById("invoice-print"),e=document.createElement("iframe");e.style.position="fixed",e.style.right="0",e.style.bottom="0",e.style.width="0",e.style.height="0",e.style.border="0",document.body.appendChild(e);const d=e.contentWindow.document,$=`
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
  `;d.open(),d.write(`
    <html>
      <head>
        <title>Invoice</title>
        ${$}
      </head>
      <body>
        ${l.innerHTML}
      </body>
    </html>
  `),d.close(),e.contentWindow.focus(),e.contentWindow.print()},P=l=>{const e=new Date(l);return e.toLocaleDateString()+" "+e.toLocaleTimeString()},M=l=>({pending:"info",processing:"warning",cancelled:"danger"})[l.toLowerCase()]||"info",W=async l=>{try{const e=JSON.parse(localStorage.getItem("tokenData"));if(!e||!e.token)throw new Error("Authentication token not found");h.defaults.headers.common.Authorization=`Bearer ${e.token}`;const d=await h.post(`https://backend.webenia.org/api/orders/${l.id}/cancel`);if(d.data.status===!0)b.success("Order cancelled successfully"),await I();else throw new Error(d.data.message||"Failed to cancel order")}catch(e){console.error("Error cancelling order:",e),b.error(e.message||"Failed to cancel order")}},J=l=>{b.info("Reordered items from order #"+l.id)};return Z(()=>{I()}),(l,e)=>{const d=i("el-icon"),$=i("el-input"),Q=i("el-option"),q=i("el-select"),_=i("el-table-column"),G=i("el-tag"),f=i("el-button"),H=i("el-table"),R=i("el-pagination"),K=i("el-dialog"),X=ee("loading");return u(),v("div",se,[t("div",re,[t("h2",null,a(l.$t("orders.myOrders")),1),n($,{modelValue:m.value,"onUpdate:modelValue":e[0]||(e[0]=o=>m.value=o),placeholder:l.$t("orders.Search-orders"),class:"search-input",clearable:""},{prefix:s(()=>[n(d,null,{default:s(()=>[n(y(le))]),_:1})]),_:1},8,["modelValue","placeholder"])]),t("div",de,[n(q,{modelValue:g.value,"onUpdate:modelValue":e[1]||(e[1]=o=>g.value=o),placeholder:l.$t("orders.Filter-by-Status"),clearable:""},{default:s(()=>[(u(),v(F,null,L(N,o=>n(Q,{key:o,label:o,value:o},null,8,["label","value"])),64))]),_:1},8,["modelValue","placeholder"])]),te((u(),S(H,{data:T.value,id:"orders-table",style:{width:"100%"},class:"orders-table",stripe:"",border:""},{default:s(()=>[n(_,{prop:"id",label:l.$t("orders.orderId"),width:"120"},null,8,["label"]),n(_,{prop:"ordered_at",label:l.$t("orders.orderDate"),width:"180"},{default:s(o=>[p(a(P(o.row.ordered_at)),1)]),_:1},8,["label"]),n(_,{label:l.$t("orders.total"),width:"150"},{default:s(o=>[p(a(o.row.currency)+" "+a(o.row.total_price),1)]),_:1},8,["label"]),n(_,{prop:"status",label:l.$t("orders.status"),width:"150"},{default:s(o=>[n(G,{type:M(o.row.status)},{default:s(()=>[p(a(o.row.status),1)]),_:2},1032,["type"])]),_:1},8,["label"]),n(_,{label:l.$t("orders.actions"),width:"220"},{default:s(o=>[n(f,{size:"small",type:"primary",onClick:O=>U(o.row),circle:""},{default:s(()=>[n(d,null,{default:s(()=>[n(y(oe))]),_:1})]),_:2},1032,["onClick"]),n(f,{size:"small",type:"danger",disabled:o.row.status!=="pending"&&o.row.status!=="processing",onClick:O=>W(o.row),circle:""},{default:s(()=>[n(d,null,{default:s(()=>[n(y(ae))]),_:1})]),_:2},1032,["disabled","onClick"]),n(f,{size:"small",type:"success",onClick:O=>J(o.row),circle:""},{default:s(()=>[n(d,null,{default:s(()=>[n(y(ne))]),_:1})]),_:2},1032,["onClick"])]),_:1},8,["label"])]),_:1},8,["data"])),[[X,D.value]]),C.value.length>w?(u(),S(R,{key:0,class:"pagination",layout:"prev, pager, next","current-page":k.value,"page-size":w,total:C.value.length,onCurrentChange:A},null,8,["current-page","total"])):B("",!0),n(K,{modelValue:x.value,"onUpdate:modelValue":e[2]||(e[2]=o=>x.value=o),id:"order-details-dialog",title:l.$t("orders.orderDetails"),width:"600px"},{footer:s(()=>[r.value?(u(),S(f,{key:0,type:"primary",onClick:j},{default:s(()=>[p(a(l.$t("orders.printInvoice")||"Print Invoice"),1)]),_:1})):B("",!0)]),default:s(()=>[t("div",ie,[t("div",ce,[t("div",ue,[t("img",{src:z.value,class:"rounded object-fit-contain",width:"200",height:"100",alt:"hi"},null,8,pe),e[3]||(e[3]=t("div",null,[t("h5",null,"Elegance OUD"),t("p",{class:"mb-0"},"company's Country"),t("p",null,"Elegance@gmail.com")],-1))]),e[11]||(e[11]=t("hr",null,null,-1)),t("div",me,[t("div",_e,[e[4]||(e[4]=t("h6",null,"Billed To:",-1)),t("p",ge,a(r.value.user.name),1),t("p",fe,a(r.value.address.country.name_en),1),t("p",ve,a(r.value.user.email),1),t("p",null,a(r.value.user.phone),1)]),t("div",he,[e[7]||(e[7]=t("h6",null,"Invoice Details:",-1)),t("p",be,[e[5]||(e[5]=t("span",{class:"fw-bold"},"Invoice ID :",-1)),p(" "+a(r.value.invoice_number),1)]),t("p",ye,[e[6]||(e[6]=t("span",{class:"fw-bold"},"Date:",-1)),p(" "+a(r.value.ordered_at),1)])])]),t("table",we,[e[10]||(e[10]=t("thead",{class:"table-light"},[t("tr",null,[t("th",null,"#"),t("th",null,"Description"),t("th",null,"Unit Price"),t("th",null,"Quantity"),t("th",null,"Subtotal")])],-1)),t("tbody",null,[(u(!0),v(F,null,L(r.value.items,o=>(u(),v("tr",{key:o.id},[t("td",null,a(o.product_id),1),t("td",null,a(o.product.name_en),1),t("td",null,a(o.price)+" "+a(r.value.currency),1),t("td",null,a(o.quantity),1),t("td",null,a(o.subtotal),1)]))),128))]),t("tfoot",null,[t("tr",null,[e[8]||(e[8]=t("th",{colspan:"4",class:"text-end"},"Delivery",-1)),t("th",ke,a(r.value.delivery_fee),1)]),t("tr",null,[e[9]||(e[9]=t("th",{colspan:"4",class:"text-end"},"Total",-1)),t("th",xe,a(r.value.currency)+" "+a(r.value.total_price),1)])])]),e[12]||(e[12]=t("p",{class:"mt-4 text-center fw-bold"},"Elegance happy to see you again",-1))])])]),_:1},8,["modelValue","title"])])}}},Se=Y(De,[["__scopeId","data-v-715bcf08"]]);export{Se as default};
