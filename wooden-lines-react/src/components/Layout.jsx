import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import { useState } from 'react';
export default function Layout() { const [lang, setLang] = useState('en'); return <><SiteHeader lang={lang} setLang={setLang}/><main><Outlet context={{ lang }}/></main><Footer/><ChatWidget lang={lang}/></>; }
