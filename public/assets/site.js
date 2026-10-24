(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.getElementById('nav');
  addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>8)},{passive:true});

  function onView(el,fn,th){
    if(!el)return;
    var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){fn(e.target);o.unobserve(e.target)}})},{threshold:th||.25});
    o.observe(el);
  }
  document.querySelectorAll('.rv').forEach(function(el){onView(el,function(t){t.classList.add('in')},.12)});
  function seq(items,cls,gap,start){items.forEach(function(it,i){setTimeout(function(){it.classList.add(cls)},(start||0)+i*gap)})}
  function type(el,text,speed,done){
    var n=0;el.innerHTML='<span class="cur"></span>';
    var t=setInterval(function(){n+=2;el.innerHTML=text.slice(0,n).replace(/\n/g,'<br>')+'<span class="cur"></span>';
      if(n>=text.length){clearInterval(t);el.innerHTML=text.replace(/\n/g,'<br>');done&&done()}},speed);
    return t;
  }
  function chips(box,list,prefix,t0,step,timers){
    box.innerHTML=list.map(function(p){return '<span><img src="'+p[0]+'" alt="">'+(prefix||'')+p[1]+'</span>'}).join('');
    [].slice.call(box.children).forEach(function(c,k){
      timers.push(setTimeout(function(){c.classList.add('show')},t0+k*step));
      timers.push(setTimeout(function(){c.classList.add('done')},t0+step*.8+k*step));
    });
    return t0+list.length*step;
  }

  /* hero demo: question, sources pulled one by one, answer typed */
  if(document.getElementById('tabs')){
  var demos=[
    {cap:"Ask a teammate's capy. It answers from their work.",q:"Where is the latest version of the Q3 budget?",who:"Sam's capy",img:"img/capy-1.png",
     pull:[["icons/googledrive.svg","Drive"],["icons/gmail.svg","Gmail"],["icons/googlecalendar.svg","Calendar"]],
     a:"It's v6 in the Finance folder. Sam updated the hiring line on Tuesday and sent it to Finance at 4:12 pm, ahead of Thursday's review. I've attached it."},
    {cap:"A written stand-up from everyone's tasks, every morning.",q:"What is everyone working on today?",who:"Team stand-up",img:"img/capy-notes.png",
     pull:[["icons/linear.svg","Tasks"],["icons/googlecalendar.svg","Calendars"],["icons/slack.svg","Slack"]],
     a:"Maya is reviewing the launch plan. Sam is closing the vendor B contract. Leo is telling the pilot customers about 12 May. One blocker: the quote is waiting on the site address."},
    {cap:"Ask what someone did, why, and where it is.",q:"Why did we pick this supplier last year?",who:"Maya's capy",img:"img/capy-wave.png",
     pull:[["icons/googledocs.svg","Docs"],["icons/gmail.svg","Gmail"]],
     a:"Only one had a lead time under six weeks, and the other two failed the quality check. The comparison sheet is in Procurement, and the approval email is attached."}
  ];
  var tabs=document.querySelectorAll('#tabs button'),side=document.querySelectorAll('.side a'),
      q=document.getElementById('q'),who=document.getElementById('who'),whoimg=document.getElementById('whoimg'),
      pull=document.getElementById('pull'),ans=document.getElementById('ans'),cap=document.getElementById('cap'),
      cur=0,tt=null,timers=[],cycle=null;
  function show(i){
    clearInterval(tt);timers.forEach(clearTimeout);timers=[];cur=i;
    tabs.forEach(function(b,j){b.classList.toggle('on',j===i)});
    side.forEach(function(b,j){b.classList.toggle('on',j===i)});
    var d=demos[i];cap.textContent=d.cap;q.textContent=d.q;who.textContent=d.who;whoimg.src=d.img;ans.innerHTML='';
    var end=chips(pull,d.pull,'Reading ',300,450,timers);
    timers.push(setTimeout(function(){tt=type(ans,d.a,16)},end+200));
  }
  function auto(){clearInterval(cycle);cycle=setInterval(function(){show((cur+1)%demos.length)},10000)}
  tabs.forEach(function(b,i){b.addEventListener('click',function(){show(i);auto()})});
  [0,1,2].forEach(function(i){side[i].addEventListener('click',function(){show(i);auto()})});
  show(0);auto();
  }

  /* pipeline: wires from sources into the context, answers out */
  if(document.getElementById('flow')){
  var flow=document.getElementById('flow'),wires=document.getElementById('wires'),ctxbox=document.getElementById('ctxbox');
  function drawWires(){
    if(innerWidth<1000){wires.innerHTML='';return}
    var fr=flow.getBoundingClientRect(),cb=ctxbox.getBoundingClientRect(),html='';
    var tx=cb.left-fr.left,ty=cb.top-fr.top+cb.height/2;
    document.querySelectorAll('#srcs .s').forEach(function(s,i){
      var r=s.getBoundingClientRect(),x=r.right-fr.left,y=r.top-fr.top+r.height/2,mx=(x+tx)/2;
      var d='M'+x+' '+y+' C'+mx+' '+y+' '+mx+' '+ty+' '+tx+' '+ty;
      html+='<path d="'+d+'" stroke="#D9E0F4" stroke-width="1.2" fill="none"/>';
      html+='<circle r="3.5" fill="#022FDB"><animateMotion dur="'+(2.4+i*.35)+'s" repeatCount="indefinite" begin="'+(i*.5)+'s" path="'+d+'"/></circle>';
    });
    var ox=cb.right-fr.left;
    document.querySelectorAll('.outs .o').forEach(function(o,i){
      var r=o.getBoundingClientRect(),x=r.left-fr.left,y=r.top-fr.top+r.height/2,mx=(ox+x)/2;
      var d='M'+ox+' '+ty+' C'+mx+' '+ty+' '+mx+' '+y+' '+x+' '+y;
      html+='<path d="'+d+'" stroke="#D9E0F4" stroke-width="1.2" fill="none" stroke-dasharray="4 4"/>';
      html+='<circle r="3" fill="#FB4D03"><animateMotion dur="2.8s" repeatCount="indefinite" begin="'+(1+i*.7)+'s" path="'+d+'"/></circle>';
    });
    wires.innerHTML=html;
  }
  var ctxEvents=[
    ["icons/gmail.svg","Sent the Q3 budget to Finance","Tue 4:12 pm"],
    ["icons/googlecalendar.svg","Product sync: launch moved to 12 May","Thu 11:00 am"],
    ["icons/googledocs.svg","Updated the launch plan, section 3","Thu 2:40 pm"],
    ["icons/slack.svg","Agreed vendor B for lead time","Thu 5:05 pm"],
    ["icons/linear.svg","Closed: pricing page copy","Fri 9:30 am"]
  ];
  var list=document.getElementById('ctxlist');
  list.innerHTML=ctxEvents.map(function(e){return '<li><img src="'+e[0]+'" alt=""><span>'+e[1]+'</span><time>'+e[2]+'</time></li>'}).join('');
  onView(flow,function(){
    setTimeout(drawWires,850);
    seq([].slice.call(list.children),'show',700,600);
    setTimeout(function(){document.getElementById('und').classList.add('show')},600+ctxEvents.length*700);
  },.2);
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(wires.innerHTML||innerWidth>=1000)drawWires()},150)});
  }

  onView(document.getElementById('meet'),function(){seq([].slice.call(document.querySelectorAll('#notes li')),'show',650,300)});

  onView(document.getElementById('stand'),function(){
    var li=document.querySelectorAll('#stand .todo li');
    seq([li[4],li[0],li[1],li[2]],'done',800,600);
  });

  onView(document.getElementById('draft'),function(){
    var t=[],on=document.getElementById('dOn'),doc=document.getElementById('dDoc'),txt=document.getElementById('dTxt');
    t.push(setTimeout(function(){on.classList.add('show')},300));
    var end=chips(document.getElementById('dPull'),[["icons/gmail.svg","Client thread"],["icons/googlecalendar.svg","Product sync"],["icons/googledocs.svg","Launch plan"]],'',700,450,t);
    setTimeout(function(){doc.classList.add('show');type(txt,"Hi Dana,\nConfirming the launch is now 12 May. We moved it two weeks to finish packaging with our new supplier. Your onboarding call stays on 14 May, and I'll send the updated plan by Friday.\nBest,\nMaya",14)},end+300);
  });

  onView(document.getElementById('hand'),function(){seq([].slice.call(document.querySelectorAll('#hand .msg')),'show',900,300)});

  onView(document.getElementById('sky'),function(){
    var m=document.querySelectorAll('#slackmsgs .msg'),typing=document.getElementById('sTyping'),rep=document.getElementById('sReply');
    m[0].classList.add('show');
    setTimeout(function(){typing.classList.add('show')},900);
    setTimeout(function(){typing.style.display='none';rep.style.display='flex';requestAnimationFrame(function(){rep.classList.add('show')})},2600);
  },.3);

  onView(document.getElementById('dev'),function(){
    setTimeout(function(){type(document.getElementById('pAsk'),"What did we decide about the launch date?",30,function(){setTimeout(function(){document.getElementById('pRep').classList.add('show')},500)})},500);
  },.3);

  var bill=document.getElementById('bill');
  if(bill){bill.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){
    bill.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)});
    var yr=b.dataset.p==='y';document.querySelectorAll('[data-m]').forEach(function(el){el.textContent=yr?el.dataset.y:el.dataset.m});
    document.querySelectorAll('.per').forEach(function(el){el.textContent=yr?'/ person / month, billed yearly':'/ person / month'});
  })})}
  if(reduce){document.querySelectorAll('.msg,.notes li,.ctxbox li,.und,.pull span,.rep').forEach(function(e){e.classList.add('show')})}
})();
