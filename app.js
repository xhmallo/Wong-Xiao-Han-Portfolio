const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sections = [
  {id:'education', title:'Education', entries:[
    {title:'National University of Singapore', date:'Aug 2024 – May 2028 (Expected)', subtitle:'Bachelor of Science (Hons) in Data Science and Analytics · Second Major in Economics', points:[
      'Relevant coursework: Machine Learning, Cloud-based Data Science and Programming, Statistical Methods, Regression Analysis, Data Visualisation, Data Structures & Algorithms, Microeconomics, and Macroeconomics.'
    ]},
    {title:'Raffles Institution', date:'Feb 2022 – Dec 2023', subtitle:'Singapore-Cambridge GCE A-Levels', points:[
      'H2 Mathematics, H2 Economics, H2 Biology, and H2 Chemistry.'
    ]}
  ]},
  {id:'skills', title:'Technical Skills', entries:[
    {title:'Programming Languages', subtitle:'Python · SQL · R · Java · HTML'},
    {title:'Data Visualisation', subtitle:'Tableau · Power BI'},
    {title:'Other Skills', subtitle:'Microsoft Office Suite · Video Editing'},
    {title:'Languages', points:[
      'English and Chinese: proficient in spoken and written communication.',
      'Malay: elementary in spoken and written communication.'
    ]}
  ]},
  {id:'experience', title:'Work Experience', entries:[]},
  {id:'projects', title:'Competitions & Projects', entries:[
    {title:'Tencent Cloud Hackathon Healthcare Track', date:'Oct 2026', label:'Singapore · Participant', points:[
      'Developed and deployed a bilingual web application in English and Chinese to support emotional reflection and appointment preparation for mothers experiencing postpartum depression.',
      'Integrated context-aware AI follow-up questions with timestamped mood ratings, activity logs, and social context to help users articulate their emotional experiences between appointments.',
      'Built interactive visualisations of emotion trends and PDF report generation to consolidate user-selected journal entries, recorded patterns, and consultation priorities into structured reports for discussion with healthcare providers.'
    ]},
    {title:'Tencent Cloud Hackathon Animation Track Global Finals', date:'Sept 2026', label:'Shenzhen · 3rd Place International Winner', points:[
      'Placed 3rd among 42 teams at the international finals, with every team having won a local qualifying competition.',
      'Developed an AI-driven interactive game using Miora for generative video synthesis and WorkBuddy for AI-assisted game development and integration.',
      'Designed a multi-path narrative framework with conditional branching logic, decision-driven scene transitions, and dynamic storyline progression in response to player interactions.',
      'Integrated AI-generated cinematic assets with interactive gameplay mechanics, enabling smooth navigation across divergent narrative pathways and cohesive visual storytelling.'
    ]},
    {title:'Tencent Cloud Hackathon Animation Track', date:'Jul 2026 – Aug 2026', label:'Singapore · 1st Place Winner', points:[
      'Developed a multi-stage asset-generation pipeline in Miora to transform natural language descriptions into a cohesive animated video.',
      'Created a standardised prompt engineering framework to control generation parameters, minimise variation caused by AI hallucinations, and maintain visual consistency across continuous 3D scenes.',
      'Streamlined the creative workflow by modularising prompt structures for characters and environments, enabling rapid iteration and consistent visual outputs throughout the video’s runtime.'
    ]},
    {title:'Infineon Supply Chain Case Challenge', date:'Jun 2026 – Jul 2026', label:'Participant', points:[
      'Proposed a graph-based framework using kNN and GraphSAGE to analyse semiconductor logistics and map dynamic supply-chain routes.',
      'Implemented a modified Dijkstra’s algorithm to optimise routing, integrating a multilayer perceptron (MLP) for route pruning and efficiency forecasting.',
      'Combined Monte Carlo simulations with XGBoost models to assess risk factors quantitatively and estimate probability distributions for potential disruptions in the logistics network.'
    ]},
    {title:'Urban Infrastructure Analysis', date:'Jan 2026 – Apr 2026', label:'DSA2101 Project · Python', points:[
      'Processed 10,000+ U.S. intersection records from 1970–2023 in Python as part of a group project to investigate temporal adoption trends and policy factors influencing civil infrastructure design.',
      'Conducted interactive spatial and time-series analysis using animated choropleth maps in Plotly across 13 four-year intervals to examine geographic distribution and state-level infrastructure buildout patterns.',
      'Performed multivariate analysis of intersection geometry using cross-tabulation heat maps to assess correlations between approach complexity and multilane capacity configurations in relation to safety constraints.'
    ]},
    {title:'Heart Disease Statistical Analysis', date:'Jan 2025 – Apr 2025', label:'DSA1101 Project · R', points:[
      'Prepared a 300-patient clinical dataset through data cleaning, mode imputation, and feature standardisation to evaluate cardiovascular risk factors.',
      'Conducted exploratory data analysis using contingency tables, odds ratios, and distribution boxplots to identify significant predictor variables.',
      'Trained and benchmarked k-nearest neighbours, decision tree, and logistic regression models using five-fold cross-validation to compare predictive performance.'
    ]},
    {title:'NUS Datathon', date:'Jan 2025 – Feb 2025', label:'Participant', points:[
      'Developed and executed a machine-learning workflow for classification, applying data cleaning, missing-value imputation, winsorisation, and outlier management to improve data quality for modelling.',
      'Benchmarked Random Forest and XGBoost classifiers using precision, recall, and F1-score to compare predictive performance and select the best-performing model for the classification task.'
    ]}
  ]},
  {id:'awards', title:'Awards & Certificates', entries:[
    {title:'3rd Place International Winner', date:'Sept 2026', label:'Award', subtitle:'Tencent Cloud Hackathon Animation Track Global Finals · Shenzhen', points:[
      'Placed 3rd among 42 teams at the international finals, with every team having won a local qualifying competition.'
    ]},
    {title:'1st Place Winner', date:'Jul 2026 – Aug 2026', label:'Award', subtitle:'Tencent Cloud Hackathon Animation Track · Singapore'},
    {title:'AWS Academy Graduate – Cloud Architecting', label:'Certificate', subtitle:'Amazon Web Services (AWS)'},
    {title:'AWS Academy Graduate – Cloud Foundations', label:'Certificate', subtitle:'Amazon Web Services (AWS)'},
    {title:'Getting Up to Speed with Docker', label:'Certificate', subtitle:'Dell Technologies'},
    {title:'Exploring Kubernetes', label:'Certificate', subtitle:'Dell Technologies'},
    {title:'Certified SOLIDWORKS Electrical Associate (CSWA-E)', label:'Certificate', subtitle:'Dassault Systèmes'}
  ]},
  {id:'activities', title:'Leadership Experience', entries:[
    {title:'Ridge View Residential College Bouldering Interest Group', date:'Jan 2025 – Feb 2026', label:'Vice-Captain', points:[
      'Planned and facilitated weekly bouldering sessions for approximately 30 members, coordinating logistical needs.',
      'Managed the club’s annual work plan and operating budget of $300, optimising resource allocation for planned activities.',
      'Led outreach and publicity initiatives that increased active club membership and climber retention.'
    ]},
    {title:'Raffles Institution', date:'Feb 2022 – Dec 2023', label:'Class Leader', points:[
      'Coordinated class administration, logistics, and budget allocation for cohort events and student initiatives.',
      'Served as the primary liaison between students and faculty to support student welfare.'
    ]}
  ]}
];
gsap.registerPlugin(ScrollTrigger);
const lenis = reduce ? null : new Lenis({duration:1.05,smoothWheel:true,anchors:true});
if(lenis){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}

// Keep the reference header's fade and outward movement.
if(!reduce){
  const headerMotion=gsap.timeline({scrollTrigger:{start:0,end:()=>Math.min(360,innerHeight*.55),scrub:.25,invalidateOnRefresh:true}});
  headerMotion.to('.site-header',{'--header-detail-opacity':0,duration:1,ease:'none'},0)
    .to('.header-motto',{opacity:0,duration:1,ease:'none'},0)
    .to('.site-header > .monogram',{x:()=>-innerWidth*(innerWidth<=700?.025:.04),duration:1,ease:'none'},0)
    .to('.site-header > .menu-toggle',{x:()=>innerWidth*(innerWidth<=700?.025:.04),duration:1,ease:'none'},0);
}

let currentDialog=null, restoreFocus=null, closing=false;
const navButtons=()=>sections.map((s,i)=>`<button data-panel="${s.id}"><span class="nav-number">0${i+1}</span><span>${s.title}</span><span class="nav-arrow" aria-hidden="true">↗</span></button>`).join('');
$('.resume-grid').innerHTML=navButtons();
document.body.insertAdjacentHTML('beforeend',`
<dialog id="navigation" class="overlay nav-overlay" aria-labelledby="nav-title">
  <div class="overlay-top"><a class="monogram" href="#identity" data-home aria-label="Wong Xiao Han, back to top">XH</a><span class="eyebrow" id="nav-title">EXPLORE THE PORTFOLIO</span><button class="close-dialog" aria-label="Close menu">CLOSE <span>×</span></button></div>
  <nav class="overlay-nav" aria-label="Portfolio sections" data-lenis-prevent>${navButtons()}</nav>
  <div class="overlay-bottom"><span>WONG XIAO HAN <span lang="zh">/ 黄筱涵</span></span><span>DATA SCIENCE | ECONOMICS</span></div>
</dialog>
<dialog id="information" class="overlay info-overlay" aria-labelledby="panel-title">
  <div class="overlay-top"><button class="back-menu">← ALL SECTIONS</button><span class="eyebrow">WONG XIAO HAN / PORTFOLIO</span><button class="close-dialog" aria-label="Close information panel">CLOSE <span>×</span></button></div>
  <div class="panel-scroll" data-lenis-prevent><div class="panel-heading"><p class="eyebrow" id="panel-number"></p><h2 id="panel-title"></h2></div><div class="panel-content"></div><button class="panel-end close-dialog">BACK TO PORTFOLIO ↑</button></div>
</dialog>
<dialog id="welcome" class="welcome" aria-labelledby="welcome-title">
  <button class="welcome-close" aria-label="Dismiss introduction">×</button><p class="eyebrow">PERSONAL PORTFOLIO</p>
  <h2 id="welcome-title">Wong Xiao Han<span class="welcome-chinese" lang="zh">黄筱涵</span></h2>
  <p class="welcome-discipline">Data Science | Economics</p>
  <p>Studying Data Science and Analytics, with a second major in Economics at the National University of Singapore.</p>
  <button class="welcome-enter">EXPLORE PORTFOLIO <span aria-hidden="true">↗</span></button>
</dialog>`);

function showDialog(d,keepFocus=false){
  if(closing)return;
  if(!keepFocus)restoreFocus=document.activeElement;
  if(currentDialog)currentDialog.close();
  currentDialog=d;
  gsap.killTweensOf(d);
  d.style.pointerEvents='none';
  d.showModal();
  lenis?.stop();
  document.documentElement.classList.add('modal-open');
  $('.menu-toggle').setAttribute('aria-expanded',d.id==='navigation'?'true':'false');
  gsap.fromTo(d,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:reduce?0:.7,ease:'power3.inOut',onComplete:()=>{d.style.pointerEvents='auto';}});
  if(d.id==='navigation')gsap.fromTo(d.querySelectorAll('nav button'),{y:40,opacity:0},{y:0,opacity:1,stagger:.055,duration:reduce?0:.65,delay:reduce?0:.25,ease:'power3.out'});
}
function closeDialog(){
  if(!currentDialog||closing)return;
  closing=true;
  const d=currentDialog;
  gsap.to(d,{clipPath:'inset(0 0 100% 0)',duration:reduce?0:.45,ease:'power3.inOut',onComplete:()=>{
    d.close();currentDialog=null;closing=false;
    document.documentElement.classList.remove('modal-open');
    lenis?.start();$('.menu-toggle').setAttribute('aria-expanded','false');
    restoreFocus?.focus({preventScroll:true});
  }});
}
function showPanel(id){
  const i=sections.findIndex(s=>s.id===id),s=sections[i];
  if(!s)return;
  $('#panel-title').textContent=s.title;
  $('#panel-number').textContent=`0${i+1} / 06`;
  const content=$('.panel-content');
  content.replaceChildren();
  if(s.entries.length){
    s.entries.forEach((entry,index)=>{
      const article=document.createElement('article');
      article.className='resume-entry';
      const meta=document.createElement('div');
      meta.className='entry-meta';
      const number=document.createElement('span');
      number.className='entry-number';
      number.textContent=String(index+1).padStart(2,'0');
      meta.append(number);
      for(const value of [entry.date,entry.label]){
        if(!value)continue;
        const detail=document.createElement('span');
        detail.textContent=value;
        meta.append(detail);
      }
      const body=document.createElement('div');
      body.className='entry-body';
      const title=document.createElement('h3');
      title.textContent=entry.title;
      body.append(title);
      if(entry.subtitle){
        const subtitle=document.createElement('p');
        subtitle.className='entry-subtitle';
        subtitle.textContent=entry.subtitle;
        body.append(subtitle);
      }
      if(entry.points?.length){
        const list=document.createElement('ul');
        for(const point of entry.points){
          const item=document.createElement('li');
          item.textContent=point;
          list.append(item);
        }
        body.append(list);
      }
      article.append(meta,body);
      content.append(article);
    });
  }else{
    content.innerHTML='<div class="panel-empty"><span class="empty-mark" aria-hidden="true">—</span><div><h3>Coming soon.</h3><p>This space is ready for the next chapter.</p></div></div>';
  }
  showDialog($('#information'),!!currentDialog);
  $('.panel-scroll').scrollTop=0;
}
$('.menu-toggle').addEventListener('click',()=>showDialog($('#navigation')));
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-panel]');
  if(b)showPanel(b.dataset.panel);
  if(e.target.closest('.close-dialog'))closeDialog();
  if(e.target.closest('.back-menu'))showDialog($('#navigation'),true);
  if(e.target.closest('[data-home]')){
    e.preventDefault();closeDialog();
    setTimeout(()=>lenis?lenis.scrollTo(0):window.scrollTo({top:0,behavior:reduce?'instant':'smooth'}),reduce?0:460);
  }
});
function dismissWelcome(){try{sessionStorage.setItem('xiao-han-portfolio-visited','1');}catch{}closeDialog();}
$$('dialog').forEach(d=>d.addEventListener('cancel',e=>{e.preventDefault();d.id==='welcome'?dismissWelcome():closeDialog();}));
$('.welcome-close').onclick=dismissWelcome;
$('.welcome-enter').onclick=dismissWelcome;
let visited=false;
try{visited=sessionStorage.getItem('xiao-han-portfolio-visited')==='1';}catch{}
if(!visited)showDialog($('#welcome'));

if(!reduce){
  const identity=gsap.timeline({scrollTrigger:{trigger:'.identity',pin:'.identity-stage',start:'top top',end:()=>'+='+window.innerHeight*2.2,scrub:.65,invalidateOnRefresh:true}});
  identity.to({}, {duration:.25})
    .to('.english-name span:first-child',{xPercent:-95,yPercent:-20,rotation:-8,opacity:0,duration:1.5,ease:'power2.inOut'},.25)
    .to('.english-name span:last-child',{xPercent:110,yPercent:25,rotation:9,opacity:0,duration:1.5,ease:'power2.inOut'},.25)
    .fromTo('.chinese-name span',{y:140,rotationY:65,scale:.7,opacity:0,filter:'blur(16px)'},{y:0,rotationY:0,scale:1,opacity:1,filter:'blur(0px)',duration:1.35,stagger:.16,ease:'power2.out'},.85)
    .to('.identity-stage',{backgroundColor:'#f4d5df',color:'#653348',duration:.8},1.7)
    .to({}, {duration:.5});
  const about=gsap.timeline({scrollTrigger:{trigger:'.about',pin:'.about-stage',start:'top top',end:()=>'+='+window.innerHeight*2.5,scrub:.5},onUpdate(){
    const i=this.time()>=2.15?2:this.time()>=.8?1:0;
    $$('.word').forEach((w,j)=>w.classList.toggle('active',j===i));
    $('.about-index').textContent=`0${i+1} / 03`;
  }});
  gsap.set('.about-text:not(:first-child)',{autoAlpha:0,y:65});
  about.to({}, {duration:.6}).to('.about-text:nth-child(1)',{y:-70,autoAlpha:0,duration:.5})
    .to('.about-text:nth-child(2)',{y:0,autoAlpha:1,duration:.6},'<.2').to({}, {duration:.55})
    .to('.about-text:nth-child(2)',{y:-70,autoAlpha:0,duration:.5})
    .to('.about-text:nth-child(3)',{y:0,autoAlpha:1,duration:.6},'<.2').to({}, {duration:.8});
  gsap.from('.resume-grid button',{y:40,opacity:0,stagger:.08,duration:.8,scrollTrigger:{trigger:'.resume-grid',start:'top 90%'}});
}else{document.body.classList.add('reduced-motion');}
window.addEventListener('load',()=>ScrollTrigger.refresh());
document.fonts.ready.then(()=>ScrollTrigger.refresh());
