/**
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */
!function(e){function t(e,t){var a=e.x-t.x,r=e.y-t.y;return i>a*a+r*r}function a(e){for(var t=e.head;t;){var a=t.next;t.next=t.prev,t.prev=a,t=a}var a=e.head;e.head=e.tail,e.tail=a}function r(e){this.level=e,this.s=null,this.count=0}function n(e){if(e)this.drawContour=e;else{var t=this;t.contours={},this.drawContour=function(e,a,n,i,s,h){var l=t.contours[h];l||(l=t.contours[h]=new r(s)),l.addSegment({x:e,y:a},{x:n,y:i})},this.contourList=function(){var e=[],a=t.contours;for(var r in a)for(var n=a[r].s,i=a[r].level;n;){var s=n.head,h=[];for(h.level=i,h.k=r;s&&s.p;)h.push(s.p),s=s.next;e.push(h),n=n.next}return e.sort(function(e,t){return e.k-t.k}),e}}this.h=new Array(5),this.sh=new Array(5),this.xh=new Array(5),this.yh=new Array(5)}e.Conrec=n;var i=1e-10;r.prototype.remove_seq=function(e){e.prev?e.prev.next=e.next:this.s=e.next,e.next&&(e.next.prev=e.prev),--this.count},r.prototype.addSegment=function(e,r){for(var n=this.s,i=null,s=null,h=!1,l=!1;n&&(null==i&&(t(e,n.head.p)?(i=n,h=!0):t(e,n.tail.p)&&(i=n)),null==s&&(t(r,n.head.p)?(s=n,l=!0):t(r,n.tail.p)&&(s=n)),null==s||null==i);)n=n.next;var o=(null!=i?1:0)|(null!=s?2:0);switch(o){case 0:var u={p:e,prev:null},v={p:r,next:null};u.next=v,v.prev=u,i={head:u,tail:v,next:this.s,prev:null,closed:!1},this.s&&(this.s.prev=i),this.s=i,++this.count;break;case 1:var c={p:r};h?(c.next=i.head,c.prev=null,i.head.prev=c,i.head=c):(c.next=null,c.prev=i.tail,i.tail.next=c,i.tail=c);break;case 2:var c={p:e};l?(c.next=s.head,c.prev=null,s.head.prev=c,s.head=c):(c.next=null,c.prev=s.tail,s.tail.next=c,s.tail=c);break;case 3:if(i===s){var c={p:i.tail.p,next:i.head,prev:null};i.head.prev=c,i.head=c,i.closed=!0;break}switch((h?1:0)|(l?2:0)){case 0:a(i);case 1:s.tail.next=i.head,i.head.prev=s.tail,s.tail=i.tail,this.remove_seq(i);break;case 3:a(i);case 2:i.tail.next=s.head,s.head.prev=i.tail,i.tail=s.tail,this.remove_seq(s)}}},n.prototype.contour=function(e,t,a,r,n,s,h,l,o){var u=this.h,v=this.sh,c=this.xh,p=this.yh,x=this.drawContour;this.contours={};for(var d,f,k,y,b,w,m=function(e,t){return(u[t]*c[e]-u[e]*c[t])/(u[t]-u[e])},M=function(e,t){return(u[t]*p[e]-u[e]*p[t])/(u[t]-u[e])},A=0,C=0,q=0,_=0,g=[0,1,1,0],S=[0,0,1,1],L=[[[0,0,8],[0,2,5],[7,6,9]],[[0,3,4],[1,3,1],[4,3,0]],[[9,6,7],[5,2,0],[8,0,0]]],j=n-1;j>=r;j--)for(var z=t;a-1>=z;z++){var B,D;if(B=Math.min(e[z][j],e[z][j+1]),D=Math.min(e[z+1][j],e[z+1][j+1]),b=Math.min(B,D),B=Math.max(e[z][j],e[z][j+1]),D=Math.max(e[z+1][j],e[z+1][j+1]),w=Math.max(B,D),w>=o[0]&&b<=o[l-1])for(var E=0;l>E;E++)if(o[E]>=b&&o[E]<=w){for(var F=4;F>=0;F--)F>0?(u[F]=e[z+g[F-1]][j+S[F-1]]-o[E],c[F]=s[z+g[F-1]],p[F]=h[j+S[F-1]]):(u[0]=.25*(u[1]+u[2]+u[3]+u[4]),c[0]=.5*(s[z]+s[z+1]),p[0]=.5*(h[j]+h[j+1])),v[F]=u[F]>i?1:u[F]<-i?-1:0;for(F=1;4>=F;F++)if(d=F,f=0,k=4!=F?F+1:1,y=L[v[d]+1][v[f]+1][v[k]+1],0!=y){switch(y){case 1:A=c[d],q=p[d],C=c[f],_=p[f];break;case 2:A=c[f],q=p[f],C=c[k],_=p[k];break;case 3:A=c[k],q=p[k],C=c[d],_=p[d];break;case 4:A=c[d],q=p[d],C=m(f,k),_=M(f,k);break;case 5:A=c[f],q=p[f],C=m(k,d),_=M(k,d);break;case 6:A=c[k],q=p[k],C=m(d,f),_=M(d,f);break;case 7:A=m(d,f),q=M(d,f),C=m(f,k),_=M(f,k);break;case 8:A=m(f,k),q=M(f,k),C=m(k,d),_=M(k,d);break;case 9:A=m(k,d),q=M(k,d),C=m(d,f),_=M(d,f)}x(A,q,C,_,o[E],E)}}}}}("undefined"!=typeof exports?exports:window);