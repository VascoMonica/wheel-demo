/* Browser port of the supplied wheeltask/engine.py.
   The equations, parameters and sample grid are preserved. Integration uses
   four RK4 substeps per original sample; scores come from the supplied table. */
(function (root) {
  'use strict';
  const constants = Object.freeze({r0:0.0065,alpha:14*Math.PI/180,g:9.81,k:0.00366,J:0.017,m:0.095,M:1.65});
  const duration=38, frameCount=3800, sampleInterval=duration/(frameCount-1), substeps=4;
  function validate(configuration) {
    if(!Array.isArray(configuration)||configuration.length!==4||!configuration.every(n=>Number.isInteger(n)&&n>=1&&n<=12)) throw new RangeError('Four positions from 1 to 12 are required.');
  }
  function coefficients(configuration) {
    validate(configuration);
    const r=configuration.map(n=>(4+(n-1)*2.8)/100);
    const p=constants,K=p.J/p.m+r.reduce((s,n)=>s+n*n,0);
    return {A:(r[0]-r[2])*p.g/K,B:(r[1]-r[3])*p.g/K,C:p.r0*Math.sin(p.alpha)*(4+p.M/p.m)*p.g/K,D:p.k/K};
  }
  function integrate(configuration,lastFrame,record) {
    const {A,B,C,D}=coefficients(configuration);
    const end=Math.min(frameCount-1,Math.max(0,Math.floor(lastFrame))),h=sampleInterval/substeps;
    const theta=record?new Float64Array(end+1):null,omega=record?new Float64Array(end+1):null;
    const acceleration=(q,v)=>A*Math.sin(q)+B*Math.cos(q)+C-D*v*Math.abs(v);
    let q=0,v=0,firstFinishFrame=-1;
    for(let frame=0;frame<=end;frame++) {
      if(record){theta[frame]=q;omega[frame]=v;}
      // engine.py rounds CoveredDistance to two decimals before checking 0.92 m.
      if(firstFinishFrame<0&&Math.round(constants.r0*q*100)/100>=0.92) {
        firstFinishFrame=frame;
        if(!record) return {firstFinishFrame};
      }
      if(frame===end) break;
      for(let step=0;step<substeps;step++) {
        const k1q=v,k1v=acceleration(q,v);
        const k2q=v+h*k1v/2,k2v=acceleration(q+h*k1q/2,v+h*k1v/2);
        const k3q=v+h*k2v/2,k3v=acceleration(q+h*k2q/2,v+h*k2v/2);
        const k4q=v+h*k3v,k4v=acceleration(q+h*k3q,v+h*k3v);
        q+=h*(k1q+2*k2q+2*k3q+k4q)/6;
        v+=h*(k1v+2*k2v+2*k3v+k4v)/6;
      }
    }
    return {theta,omega,firstFinishFrame,lastFrame:end,sampleInterval};
  }
  const api=Object.freeze({constants,frameCount,sampleInterval,playbackFps:83.3,distance:0.92,
    trajectory:(configuration,lastFrame=frameCount-1)=>integrate(configuration,lastFrame,true),
    crossingFrame:(configuration,lastFrame=frameCount-1)=>integrate(configuration,lastFrame,false).firstFinishFrame,
    coefficients,validate});
  root.WheelPhysics=api;
  if(typeof module==='object'&&module.exports) module.exports=api;
})(typeof window==='undefined'?globalThis:window);
