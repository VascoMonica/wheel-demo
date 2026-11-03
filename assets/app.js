/* Free-exploration controller. All asset URLs are relative for GitHub project Pages. */
const js_vars={distance:0.92,engine_params:WheelPhysics.constants};
const slopeAngleRad=14*Math.PI/180,targetDistance=92,slopeLength=92;
(function(){
  'use strict';
  const $=id=>document.getElementById(id),names=['North','East','South','West'];
  const inputs='NESW'.split('').map(n=>$('position-'+n));
  const nf=new Intl.NumberFormat('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  const initial=[6,6,6,6],state={phase:'editing',round:1,best:null,history:[],selected:null,drag:null,raf:0};
  let app,resultApp,historyApp,wheel,startText,arrivalText;
  const confirmDialog=$('confirm-dialog'),resultDialog=$('result-dialog'),wrap=$('app');
  const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function makeApp(width,height,resolution,container,label){
    const instance=new PIXI.Application({width,height,resolution,backgroundColor:0xffffff,antialias:true});
    instance.view.setAttribute('role','img');instance.view.setAttribute('aria-label',label);
    container.appendChild(instance.view);return instance;
  }
  function clearStage(instance){instance.stage.removeChildren().forEach(child=>child.destroy({children:true}));}
  function syncInputs(){const c=wheel.getWeightConfigurations();inputs.forEach((input,i)=>input.value=c[i]);return c;}
  function setControls(){
    const disabled=state.phase!=='editing'||state.drag!==null;
    inputs.forEach(input=>input.disabled=disabled);$('playback').disabled=disabled;
    $('releaseButton').disabled=disabled;wrap.dataset.draggable='false';
  }
  function createScene(configuration){
    clearStage(app);app.stage.pivot.set(-50,-50);
    wheel=new Wheel(10,10,false,...configuration);
    app.stage.addChild(wheel);
    app.stage.addChild(new Platform(10,10));
    app.stage.addChild(new FinishLine(10,10));
    app.stage.addChild(new FinishLine(10-targetDistance-1.5,10));
    app.stage.addChild(new StartLine(10+WheelPhysics.constants.r0*50,10));
    startText=new BgText(-30,13,'Starting point ↗');
    arrivalText=new BgText(10+67*0.92,36,'           ↗ \n Finishing \n point',30,15);
    if(state.round===1)app.stage.addChild(startText,arrivalText);
    syncInputs();setControls();app.render();
  }
  function drawThumbnail(instance,configuration){
    clearStage(instance);instance.stage.pivot.set(-50,-45);
    instance.stage.addChild(new Wheel(10,10,false,...configuration));instance.render();
    instance.view.setAttribute('aria-label',names.map((n,i)=>n+' '+configuration[i]).join(', '));
  }
  function wheelPoint(event){
    const rect=app.view.getBoundingClientRect();
    return wheel.toLocal(new PIXI.Point((event.clientX-rect.left)*app.screen.width/rect.width,(event.clientY-rect.top)*app.screen.height/rect.height));
  }
  function closestWeight(event){
    const point=wheelPoint(event),weights=[wheel.weightTop,wheel.weightRight,wheel.weightBottom,wheel.weightLeft];
    let index=0,distance=Infinity;
    weights.forEach((weight,i)=>{const d=Math.hypot(point.x-weight.x,point.y-weight.y);if(d<distance){index=i;distance=d;}});
    const pixelScale=app.view.getBoundingClientRect().width/app.screen.width;
    return {point,weight:weights[index],index,hit:distance*pixelScale<=(event.pointerType==='touch'?25:20)};
  }
  function endDrag(event){
    if(!state.drag||(event&&event.pointerId!==state.drag.pointerId))return;
    const {weight,pointerId,index}=state.drag;weight.alpha=1;state.drag=null;
    wrap.classList.remove('is-dragging');
    if(app.view.hasPointerCapture(pointerId))app.view.releasePointerCapture(pointerId);
    setControls();
    const c=syncInputs();$('drag-status').textContent=names[index]+' weight: '+c[index];
    $('announcement').textContent=names[index]+' position '+c[index]+' of 12.';
  }
  function attachDragging(){
    app.view.addEventListener('pointerdown',event=>{
      if(state.phase!=='editing'||state.drag||event.button!==0||event.isPrimary===false)return;
      const selection=closestWeight(event);if(!selection.hit)return;
      const vectors=[[0,-1],[1,0],[0,1],[-1,0]],[x,y]=vectors[selection.index];
      state.drag={...selection,x,y,pointerId:event.pointerId,offset:selection.point.x*x+selection.point.y*y-selection.weight.actualPosition};
      selection.weight.alpha=.5;wrap.classList.add('is-dragging');setControls();
      app.view.setPointerCapture(event.pointerId);event.preventDefault();
    });
    app.view.addEventListener('pointermove',event=>{
      if(state.phase!=='editing')return;
      if(!state.drag){wrap.dataset.draggable=String(closestWeight(event).hit);return;}
      if(event.pointerId!==state.drag.pointerId)return;
      const point=wheelPoint(event),{weight,x,y,offset,index}=state.drag;
      const position=weight.positionToConfig(point.x*x+point.y*y-offset);
      weight.setPosition(position);wheel.setWeightPositionFromWeightLocation();syncInputs();
      $('drag-status').textContent=names[index]+' weight: '+position;
      event.preventDefault();
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(name=>app.view.addEventListener(name,endDrag));
    app.view.addEventListener('pointerleave',()=>{if(!state.drag)wrap.dataset.draggable='false';});
    window.addEventListener('blur',()=>endDrag());
  }
  function previewRound(round){
    state.selected=round;
    $('history-preview').hidden=false;$('history-title').textContent='Configuration in round '+round.number+':';
    $('history-speed').textContent=nf.format(round.speed);drawThumbnail(historyApp,round.configuration);
    document.querySelectorAll('.history-cell').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.round)===round.number)));
  }
  function record(configuration,speed){
    const round={number:state.round,configuration:[...configuration],speed};state.history.push(round);
    if(state.best===null||speed>state.best.speed)state.best=round;
    $('best-speed').textContent=nf.format(state.best.speed);$('best-line').hidden=false;
    $('history').hidden=false;$('history-count').textContent='('+state.history.length+')';
    const button=document.createElement('button');button.type='button';button.className='history-cell';button.textContent=round.number;
    button.dataset.round=round.number;button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','View round '+round.number);
    button.addEventListener('click',()=>previewRound(round));button.addEventListener('mouseenter',()=>previewRound(round));button.addEventListener('focus',()=>previewRound(round));
    $('history-cells').appendChild(button);
    return round;
  }
  function finish(configuration,speed){
    state.raf=0;state.phase='result';record(configuration,speed);
    drawThumbnail(resultApp,configuration);
    $('speedResult').textContent=nf.format(speed);$('result-best').textContent=nf.format(state.best.speed);
    $('result-message').textContent=speed===0?'The wheel did not reach the finishing point.':'The wheel reached the finishing point.';
    $('releaseButton').hidden=true;
    $('announcement').textContent='Round '+state.round+'. Average speed '+nf.format(speed)+' metres per hour.';
    resultDialog.showModal();
  }
  function run(){
    if(state.phase!=='confirming')return;
    confirmDialog.close();endDrag();state.phase='running';setControls();
    const configuration=syncInputs(),speed=WheelScores.get(configuration),finishFrame=WheelScores.finishFrame(configuration);
    // Original UI checks failure after frame 650. Cap every failed run there so
    // a wheel stranded farther down the ramp cannot leave the demo waiting forever.
    const lastFrame=finishFrame>=0?finishFrame:651;
    const path=WheelPhysics.trajectory(configuration,lastFrame),rate=Number($('playback').value),start=performance.now();
    wheel.hideText();$('releaseButton').textContent='Wheel is rolling...';$('interface-instructions').style.opacity='0';
    if(reduced()){startText.visible=false;arrivalText.visible=false;}else{startText.disappear();arrivalText.disappear();}
    const animate=now=>{
      const done=reduced()?now-start>=600:(now-start)*WheelPhysics.playbackFps*rate/1000>=lastFrame;
      const at=reduced()?(done?lastFrame:0):Math.min(lastFrame,(now-start)*WheelPhysics.playbackFps*rate/1000);
      const lo=Math.floor(at),hi=Math.min(lastFrame,lo+1),fraction=at-lo;
      const angle=path.theta[lo]+(path.theta[hi]-path.theta[lo])*fraction;
      wheel.x=10+WheelPhysics.constants.r0*angle*Math.cos(slopeAngleRad)*100;
      wheel.y=10+WheelPhysics.constants.r0*angle*Math.sin(slopeAngleRad)*100;
      wheel.rotation=angle;app.render();
      if(done){finish(configuration,speed);return;}
      state.raf=requestAnimationFrame(animate);
    };
    state.raf=requestAnimationFrame(animate);
  }
  function nextRound(){
    if(state.phase!=='result')return;
    const configuration=state.history[state.history.length-1].configuration;
    resultDialog.close();state.round++;state.phase='editing';
    $('round-label').textContent='Round '+state.round;
    $('releaseButton').hidden=false;$('releaseButton').textContent='Release the Wheel';
    $('interface-instructions').style.opacity='1';$('drag-status').textContent='';
    createScene(configuration);$('releaseButton').focus({preventScroll:true});
  }
  try{
    app=makeApp(195,130,3.5,wrap,'Four movable weights on a wheel above a ramp. Use the exact-position controls for keyboard access.');
    resultApp=makeApp(120,115,2.3,$('result-wheel'),'Configuration for this round.');
    historyApp=makeApp(120,115,2.3,$('history-wheel'),'Configuration from a previous round.');
    createScene(initial);attachDragging();
    $('releaseButton').addEventListener('click',()=>{
      if(state.phase!=='editing'||state.drag)return;
      state.phase='confirming';setControls();confirmDialog.showModal();
    });
    $('confirm-release').addEventListener('click',run);
    ['cancel-release','cancel-cross'].forEach(id=>$(id).addEventListener('click',()=>confirmDialog.close()));
    confirmDialog.addEventListener('close',()=>{if(state.phase==='confirming'){state.phase='editing';setControls();}});
    $('nextRoundButton').addEventListener('click',nextRound);
    resultDialog.addEventListener('cancel',event=>{event.preventDefault();nextRound();});
    inputs.forEach((input,i)=>input.addEventListener('change',()=>{
      if(state.phase!=='editing')return;
      const c=wheel.getWeightConfigurations(),value=input.value.trim()===''?c[i]:Number(input.value);
      if(Number.isFinite(value))c[i]=Math.max(1,Math.min(12,Math.round(value)));
      wheel.setWeightPosition(...c);syncInputs();
    }));
    $('reuse').addEventListener('click',()=>{
      if(state.phase!=='editing'||!state.selected)return;
      wheel.setWeightPosition(...state.selected.configuration);syncInputs();
      $('releaseButton').focus({preventScroll:true});
    });
  }catch(error){$('load-error').hidden=false;$('releaseButton').disabled=true;console.error('Wheel initialization failed',error);}
})();
