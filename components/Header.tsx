"use client";
import Link from "next/link";
import { useState } from "react";
const nav = [["컴퓨터수리","/aa"],["노트북수리","/bb"],["데이터복구","/cc"],["PC문제해결","/dd"],["출장수리","/ee"],["수리정보","/ff"],["회사소개","/gg"]];
export function Header(){const [open,setOpen]=useState(false);return <header className="site-header"><div className="header-inner shell"><Link className="logo" href="/" onClick={()=>setOpen(false)}><span>컴</span><b>119</b><small>COMPUTER CARE</small></Link><nav className={open?"open":""} aria-label="주요 메뉴">{nav.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav><button className="menu" aria-label="메뉴 열기" aria-expanded={open} onClick={()=>setOpen(!open)}><i/><i/><i/></button></div></header>}
