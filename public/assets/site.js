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
    {cap:"Ask a teammate's Kip. It answers from their work.",q:"Where is the latest version of the Q3 budget?",who:"Sam's Kip",img:"/img/capy-1.png",
     pull:[["/icons/googledrive.svg","Drive"],["/icons/gmail.svg","Gmail"],["/icons/googlecalendar.svg","Calendar"]],
     a:"It's v6 in the Finance folder. Sam updated the hiring line on Tuesday and sent it to Finance at 4:12 pm, ahead of Thursday's review. I've attached it."},
    {cap:"A written stand-up from everyone's tasks, every morning.",q:"What is everyone working on today?",who:"Team stand-up",img:"/img/capy-notes.png",
     pull:[["/icons/linear.svg","Tasks"],["/icons/googlecalendar.svg","Calendars"],["/icons/slack.svg","Slack"]],
     a:"Maya is reviewing the launch plan. Sam is closing the vendor B contract. Leo is telling the pilot customers about 12 May. One blocker: the quote is waiting on the site address."},
    {cap:"Ask what someone did, why, and where it is.",q:"Why did we pick this supplier last year?",who:"Maya's Kip",img:"/img/capy-wave.png",
     pull:[["/icons/googledocs.svg","Docs"],["/icons/gmail.svg","Gmail"]],
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
    var d=demos[i];cap.textContent=d.cap;q.textContent=d.q;who.textContent=d.who;whoimg.src=d.img;
    tabs.forEach(function(b){var pr=b.querySelector('.prog');if(!pr){b.innerHTML='<span class="t">'+b.textContent+'</span>';pr=document.createElement('i');pr.className='prog';b.insertBefore(pr,b.firstChild)}pr.style.animation='none';void pr.offsetWidth;pr.style.animation=''});
    pull.innerHTML='';
    ans.innerHTML='<div class="think"><span class="sp"></span>Searching '+d.who.replace("'s Kip","'s work").replace('Team stand-up',"everyone's tasks")+'</div><div class="lbar"></div><div class="sk"></div><div class="sk s2"></div><div class="sk s3"></div>';
    timers.push(setTimeout(function(){
      ans.innerHTML='';
      var end=chips(pull,d.pull,'Reading ',0,420,timers);
      timers.push(setTimeout(function(){tt=type(ans,d.a,16)},end+150));
    },1500));
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
    ["/icons/gmail.svg","Sent the Q3 budget to Finance","Tue 4:12 pm"],
    ["/icons/googlecalendar.svg","Product sync: launch moved to 12 May","Thu 11:00 am"],
    ["/icons/googledocs.svg","Updated the launch plan, section 3","Thu 2:40 pm"],
    ["/icons/slack.svg","Agreed vendor B for lead time","Thu 5:05 pm"],
    ["/icons/linear.svg","Closed: pricing page copy","Fri 9:30 am"]
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



  var draftEl=document.getElementById('draft');
  function runDraft(){
    var dp=document.getElementById('dPull'),doc0=document.getElementById('dDoc'),on0=document.getElementById('dOn');
    doc0.classList.remove('show');on0.classList.remove('show');dp.innerHTML='';document.getElementById('dTxt').textContent='';
    draftGo();setTimeout(runDraft,14000);
  }
  function draftGo(){
    var t=[],on=document.getElementById('dOn'),doc=document.getElementById('dDoc'),txt=document.getElementById('dTxt');
    t.push(setTimeout(function(){on.classList.add('show')},300));
    var end=chips(document.getElementById('dPull'),[["/icons/gmail.svg","Client thread"],["/icons/googlecalendar.svg","Product sync"],["/icons/googledocs.svg","Launch plan"]],'',700,450,t);
    setTimeout(function(){doc.classList.add('show');type(txt,"Hi Dana,\nConfirming the launch is now 12 May. We moved it two weeks to finish packaging with our new supplier. Your onboarding call stays on 14 May, and I'll send the updated plan by Friday.\nBest,\nMaya",14)},end+300);
  };
  if(draftEl)onView(draftEl,runDraft,.3);

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
  /* twin: three quick scenes of on-screen work, captured, then answered */
  var twin=document.getElementById('twin');
  if(twin){
    var sc=[
      {app:'Q3 Report · Sheets',ctx:'Q3 report: revenue 482,300, up 12% on Q2 · 3:40 pm',who:'Leo',
       q:"What's the revenue figure in the Q3 report Maya worked on?",a:'$482,300 for Q3, up 12% on Q2. West was the largest region at $159,300.',src:'Q3 Report · Sheets · edited 3:40 pm'},
      {app:'Spring launch plan · Docs',ctx:'Launch plan: launch moved from 28 April to 12 May · 4:05 pm',who:'Priya',
       q:'Is the launch still on 28 April?',a:'No, it moved to 12 May. Maya updated the launch plan this afternoon to give packaging two more weeks.',src:'Spring launch plan · Docs · edited 4:05 pm'},
      {app:'Gmail · New message',ctx:'Quote sent to Dana: $18,400, delivered in three weeks · 4:30 pm',who:'Sam',
       q:'What did we quote Dana for the spring rollout?',a:'$18,400 for the full rollout, delivered in three weeks. Maya sent it at 4:30 pm and offered a call on Thursday.',src:'Gmail · to Dana · 4:30 pm'}
    ];
    var DUR=8500,scenes=twin.querySelectorAll('.scene'),apps=twin.querySelectorAll('#tapps button'),steps=document.querySelectorAll('#tsteps span'),
        toast=document.getElementById('toast'),toastTxt=document.getElementById('toastTxt'),chat=twin.querySelector('.tchat'),
        tQ=document.getElementById('tQ'),tT=document.getElementById('tT'),tA=document.getElementById('tA'),tw=[],iv=[],cur=0;
    twin.style.setProperty('--dur',DUR+'ms');
    function step(n){steps.forEach(function(s,k){s.classList.toggle('on',k===n)})}
    function later(f,ms){tw.push(setTimeout(f,ms))}
    function typeInto(el,text,speed,done){var n=0;var h=setInterval(function(){n+=2;el.innerHTML=text.slice(0,n)+'<span class="cur"></span>';if(n>=text.length){clearInterval(h);el.textContent=text;done&&done()}},speed);iv.push(h)}
    function clearAll(){tw.forEach(clearTimeout);iv.forEach(clearInterval);tw=[];iv=[]}
    function play(i){
      clearAll();cur=i;var s=sc[i],scene=scenes[i];
      scenes.forEach(function(x,k){x.classList.toggle('on',k===i)});
      apps.forEach(function(b,k){b.classList.toggle('on',k===i);var pr=b.querySelector('.prog');pr.style.animation='none';void pr.offsetWidth;pr.style.animation=''});
      document.getElementById('tApp').textContent=s.app;
      step(0);toast.classList.remove('show');chat.classList.remove('live');
      [tQ,tA].forEach(function(m){m.classList.remove('show')});tT.classList.remove('show');tT.style.display='none';tA.style.display='none';
      document.getElementById('tWho').textContent=s.who;document.getElementById('tQtxt').textContent=s.q;
      document.getElementById('tAtxt').textContent=s.a;document.getElementById('tSrc').textContent=s.src;toastTxt.textContent=s.ctx;
      var t=250;
      if(i===0){
        var cells=[].slice.call(scene.querySelectorAll('td[data-v]'));
        cells.forEach(function(c){c.textContent='';c.className=''});
        cells.forEach(function(c,k){later(function(){cells.forEach(function(x){x.classList.remove('act')});c.classList.add('act');
          typeInto(c,c.dataset.v,22,function(){if(k===cells.length-1){c.classList.remove('act');c.classList.add('fill')}})},t);t+=k===cells.length-2?520:330});
        t+=350;
      }else{
        var ty=scene.querySelector('.ty');ty.textContent='';
        var send=scene.querySelector('.send');if(send)send.classList.remove('show');
        var old=scene.querySelector('s.old');if(old)old.style.opacity='1';
        later(function(){typeInto(ty,ty.dataset.v,16,function(){if(send)send.classList.add('show')})},t);
        t+=Math.ceil(ty.dataset.v.length/2)*16+450;
      }
      later(function(){step(1);toast.classList.add('show')},t);
      later(function(){step(2);chat.classList.add('live');tQ.classList.add('show')},t+1100);
      later(function(){tT.style.display='flex';requestAnimationFrame(function(){tT.classList.add('show')})},t+1600);
      later(function(){tT.style.display='none';tA.style.display='flex';requestAnimationFrame(function(){tA.classList.add('show')})},t+2500);
      later(function(){play((i+1)%sc.length)},Math.max(DUR,t+5200));
    }
    apps.forEach(function(b,k){b.addEventListener('click',function(){play(k)})});
    onView(twin,function(){play(0)},.3);
  }
  var ctrl=document.getElementById('ctrl');
  if(ctrl){onView(ctrl,function(){
    ctrl.querySelectorAll('li').forEach(function(li,k){setTimeout(function(){li.classList.add(li.dataset.on==='1'?'on':'off')},400+k*450)});
    setTimeout(function(){ctrl.querySelector('.pause').classList.add('pulse')},400+5*450+300);
  },.3)}

  /* manager: pings pile up, then Kip answers them */
  var mgr=document.getElementById('mgr');
  if(mgr){
    var items=[].slice.call(mgr.querySelectorAll('#mlist li')),badge=document.getElementById('mbadge'),mcap=document.getElementById('mcap'),
        mb=mgr.querySelectorAll('.mseg button'),sad=mgr.querySelector('.mimgs .sad'),happy=mgr.querySelector('.mimgs .happy'),mt=[];
    var caps=["Alex is in back-to-back meetings, and the questions keep coming.","Alex's Kip answers what it already knows. Alex only gets the decision."];
    function mode(m){mb.forEach(function(b,k){b.classList.toggle('on',k===m)});sad.classList.toggle('on',m===0);happy.classList.toggle('on',m===1);mcap.textContent=caps[m]}
    function setBadge(n,ok){badge.textContent=n;badge.classList.toggle('zero',!!ok)}
    function reset(){items.forEach(function(li){li.classList.remove('show','wait','done')})}
    function runMgr(){
      mt.forEach(clearTimeout);mt=[];mode(0);setBadge(0);reset();
      items.forEach(function(li,k){mt.push(setTimeout(function(){li.classList.add('show','wait');setBadge(k+1)},400+k*650))});
      var t=400+items.length*650+1400;
      mt.push(setTimeout(function(){mode(1)},t));
      items.forEach(function(li,k){mt.push(setTimeout(function(){li.classList.remove('wait');li.classList.add('done');
        var left=items.filter(function(x){return !x.classList.contains('done')}).length;
        setBadge(left+(k===items.length-1?1:0),left===0)},t+900+k*700))});
      mt.push(setTimeout(runMgr,t+900+items.length*700+6000));
    }
    mb.forEach(function(b,k){b.addEventListener('click',function(){mt.forEach(clearTimeout);mt=[];
      if(k===0){mode(0);items.forEach(function(li){li.classList.remove('done');li.classList.add('show','wait')});setBadge(items.length)}
      else{mode(1);items.forEach(function(li){li.classList.remove('wait');li.classList.add('show','done')});setBadge(1,true)}})});
    onView(mgr,runMgr,.3);
  }

  /* privacy demo: scan, sheet seen, WhatsApp never seen, Kip declines */
  var pdemo=document.getElementById('pdemo');
  if(pdemo){
    var pQ=document.getElementById('pQ'),pT=document.getElementById('pT'),pA=document.getElementById('pA'),pt=[];
    function runP(){
      pt.forEach(clearTimeout);pt=[];pdemo.classList.remove('priv','scanning');
      [pQ,pA].forEach(function(m){m.classList.remove('show')});pT.classList.remove('show');pT.style.display='none';pA.style.display='none';
      pt.push(setTimeout(function(){pdemo.classList.add('scanning')},400));
      pt.push(setTimeout(function(){pdemo.classList.remove('scanning');pdemo.classList.add('priv')},3700));
      pt.push(setTimeout(function(){pQ.classList.add('show')},5000));
      pt.push(setTimeout(function(){pT.style.display='flex';requestAnimationFrame(function(){pT.classList.add('show')})},6000));
      pt.push(setTimeout(function(){pT.style.display='none';pA.style.display='flex';requestAnimationFrame(function(){pA.classList.add('show')})},7700));
      pt.push(setTimeout(runP,15000));
    }
    onView(pdemo,runP,.3);
  }

  /* context cloud: cards start gathered at the centre and fan out with scroll */
  var cloud=document.querySelector('.cloud');
  if(cloud&&!reduce){
    var cards=[].slice.call(cloud.querySelectorAll('.ctx')),rays=cloud.querySelector('svg.rays'),off=[],ticking=false;
    function measure(){
      off=[];var cr=cloud.getBoundingClientRect(),cx=cr.left+cr.width/2,cy=cr.top+cr.height/2;
      cards.forEach(function(c){c.style.setProperty('--dx','0px');c.style.setProperty('--dy','0px');c.style.setProperty('--s','1')});
      cards.forEach(function(c){var r=c.getBoundingClientRect();off.push([cx-(r.left+r.width/2),cy-(r.top+r.height/2)])});
    }
    function frame(){
      ticking=false;
      if(innerWidth<1000){cards.forEach(function(c){c.style.removeProperty('--dx');c.style.removeProperty('--dy');c.style.removeProperty('--s');c.style.removeProperty('--o')});return}
      var r=cloud.getBoundingClientRect(),vh=innerHeight;
      var p=Math.min(1,Math.max(0,(vh*0.95-r.top)/(vh*0.85)));
      var e=1-Math.pow(1-p,3);
      cards.forEach(function(c,k){
        var d=Math.min(1,Math.max(0,e*1.15-k*0.03));
        c.style.setProperty('--dx',(off[k][0]*(1-d)*0.92).toFixed(1)+'px');
        c.style.setProperty('--dy',(off[k][1]*(1-d)*0.92).toFixed(1)+'px');
        c.style.setProperty('--s',(0.55+0.45*d).toFixed(3));
        c.style.setProperty('--o',Math.min(1,d*1.6).toFixed(3));
      });
      if(rays){rays.style.setProperty('--rp',e.toFixed(3));rays.style.setProperty('--ro',Math.min(1,e*1.5).toFixed(3))}
    }
    function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
    measure();frame();
    addEventListener('scroll',req,{passive:true});
    addEventListener('resize',function(){measure();req()});
  }

  /* arc: apps glide along a curve; the focused app feeds the chat */
  var arc=document.getElementById('arc');
  if(arc){
    var ais=[].slice.call(arc.querySelectorAll('.ai')),focus=arc.querySelector('.focus'),fimg=document.getElementById('arcFocus'),
        aRead=document.getElementById('arcRead'),aAns=document.getElementById('arcAns'),aq=arc.querySelector('.arcq'),ac=0;
    var data=[
      ['/icons/gmail.svg','Reading Gmail','Did Dana reply about the quote?','Yes, this morning. She accepted $18,400 and asked to start on 2 June.'],
      ['/icons/googlesheets.svg','Reading Sheets','What was Q3 revenue?','$482,300, up 12% on Q2. West was the largest region.'],
      ['/icons/slack.svg','Reading Slack','Which vendor did we pick?','Vendor B, agreed in #ops on Thursday for its shorter lead time.'],
      ['/icons/notion.svg','Reading Notion','Where are the research notes?','In Customer research, updated Monday with five new interviews.'],
      ['/icons/googlecalendar.svg','Reading Calendar','When is the supplier call?','Tomorrow at 10:30 with their operations lead.'],
      ['/icons/linear.svg','Reading Linear','Is the pricing page done?','Yes, Sam closed it Friday. It goes live Tuesday.']
    ];
    var slots=[[10,14,.62,.4],[28,6,.72,.6],[47,8,.84,.85],[64,20,.95,1],[84,52,.2,0]];
    function place(){
      ais.forEach(function(el,k){
        var s=(k-ac+ais.length)%ais.length,sl=slots[Math.min(s,slots.length-1)];
        if(s>=slots.length-1)sl=s===ais.length-1?[-6,26,.5,0]:slots[slots.length-1];
        el.style.left=sl[0]+'%';el.style.top=sl[1]+'%';el.style.transform='scale('+sl[2]+')';el.style.opacity=sl[3];
      });
    }
    var card=arc.querySelector('.arccard'),body=arc.querySelector('.arcbody'),arcT=null;
    function tick(){
      var d=data[(ac+4)%data.length];
      /* the finished answer floats up and fades like a shadow */
      if(aAns.textContent){
        var ghost=body.cloneNode(true);ghost.classList.add('ghost');ghost.removeAttribute('id');
        ghost.querySelectorAll('[id]').forEach(function(x){x.removeAttribute('id')});
        card.appendChild(ghost);requestAnimationFrame(function(){requestAnimationFrame(function(){ghost.classList.add('up')})});
        setTimeout(function(){ghost.remove()},1100);
      }
      clearInterval(arcT);
      body.classList.add('enter');aAns.textContent='';
      focus.classList.add('swap');
      setTimeout(function(){fimg.src=d[0];aRead.textContent=d[1];aq.textContent=d[2];focus.classList.remove('swap');body.classList.remove('enter')},250);
      setTimeout(function(){var n=0;arcT=setInterval(function(){n+=2;aAns.innerHTML=d[3].slice(0,n)+'<span class="cur"></span>';if(n>=d[3].length){clearInterval(arcT);aAns.textContent=d[3]}},18)},900);
      ac=(ac+1)%ais.length;place();
    }
    onView(arc,function(){tick();setInterval(tick,3600)},.3);
  }

  /* meetings: gather context, notes land, cursor clicks Summary then Actions */
  var meet=document.getElementById('meet');
  if(meet&&meet.querySelector('.mgather')){
    var mv={notes:meet.querySelector('#notes'),sum:meet.querySelector('.msum'),act:meet.querySelector('.mact'),gather:meet.querySelector('.mgather')},
        mtab=meet.querySelectorAll('.mtabs span'),mcurEl=document.getElementById('mcur'),mt2=[];
    function view(k){Object.keys(mv).forEach(function(x){mv[x].classList.toggle('on',x===k)})}
    function tab(k){mtab.forEach(function(s){s.classList.toggle('on',s.dataset.t===k)})}
    function moveTo(el){var r=el.getBoundingClientRect(),m=meet.getBoundingClientRect();mcurEl.style.left=(r.left-m.left+r.width/2)+'px';mcurEl.style.top=(r.top-m.top+r.height/2)+'px'}
    function at(f,ms){mt2.push(setTimeout(f,ms))}
    function runMeet(){
      mt2.forEach(function(x){if(x&&x.ck)clearInterval(x.ck);else clearTimeout(x)});mt2=[];tab('notes');view('gather');mcurEl.style.left='75%';mcurEl.style.top='88%';
      var lis=[].slice.call(mv.notes.querySelectorAll('li'));lis.forEach(function(l){l.classList.remove('show')});
      [].slice.call(mv.act.querySelectorAll('li')).forEach(function(l){l.classList.remove('done')});
      var tl=[].slice.call(mv.gather.querySelectorAll('.tline')),clock=mv.gather.querySelector('.clock'),st0=mv.gather.querySelector('.mstate'),sec=0;
      tl.forEach(function(l){l.classList.remove('show')});st0.textContent='Listening';st0.className='mstate';clock.textContent='00:00';
      var ck=setInterval(function(){sec+=3;clock.textContent='00:'+(sec<10?'0':'')+sec},300);mt2.push({ck:ck});
      tl.forEach(function(l,k){at(function(){l.classList.add('show')},300+k*650)});
      at(function(){st0.textContent='Writing notes';st0.className='mstate w'},300+tl.length*650+200);
      at(function(){clearInterval(ck);view('notes');lis.forEach(function(l,k){at(function(){l.classList.add('show')},k*380)})},300+tl.length*650+1300);
      var t=300+tl.length*650+1300+lis.length*380+900;
      at(function(){moveTo(mtab[1])},t);
      at(function(){mcurEl.classList.add('click');tab('sum');view('sum')},t+850);
      at(function(){mcurEl.classList.remove('click');moveTo(mtab[2])},t+3200);
      at(function(){mcurEl.classList.add('click');tab('act');view('act');
        [].slice.call(mv.act.querySelectorAll('li')).forEach(function(l,k){at(function(){l.classList.add('done')},500+k*500)})},t+4050);
      at(function(){mcurEl.classList.remove('click')},t+4400);
      at(runMeet,t+8200);
    }
    onView(meet,runMeet,.3);
  }

  /* stand-up: running, updates drop in, then collapse to done cards */
  var stand=document.getElementById('stand');
  if(stand&&document.getElementById('slive')){
    var live=document.getElementById('slive'),done=document.getElementById('sdone'),st=document.getElementById('stStatus'),sl=[].slice.call(live.querySelectorAll('li')),stt=[];
    function runStand(){
      stt.forEach(clearTimeout);stt=[];
      live.classList.add('on');done.classList.remove('on');st.textContent='Running';st.className='pill g';
      sl.forEach(function(l){l.classList.remove('show','done')});
      sl.forEach(function(l,k){stt.push(setTimeout(function(){l.classList.add('show')},500+k*600))});
      sl.slice(0,3).forEach(function(l,k){stt.push(setTimeout(function(){l.classList.add('done')},500+sl.length*600+k*350))});
      var t=500+sl.length*600+1600;
      stt.push(setTimeout(function(){live.classList.remove('on');done.classList.add('on');st.textContent='✓ Done';st.className='pill b'},t));
      stt.push(setTimeout(runStand,t+4200));
    }
    onView(stand,runStand,.3);
  }

  if(reduce){document.querySelectorAll('.msg,.notes li,.ctxbox li,.und,.pull span,.rep').forEach(function(e){e.classList.add('show')})}
})();
