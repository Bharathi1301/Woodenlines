import { Menu, X, Hammer } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
export default function SiteHeader({ lang, setLang }) {
  const [menu, setMenu] = useState(false);
  const links = [['/', lang === 'ta' ? 'முகப்பு' : 'Home'], ['/gallery', lang === 'ta' ? 'புகைப்படங்கள்' : 'Projects'], ['/services', lang === 'ta' ? 'சேவைகள்' : 'Services'], ['/contact', lang === 'ta' ? 'தொடர்பு' : 'Contact']];
  return <header className="site-header"><div className="nav-wrap"><Link to="/" className="brand" onClick={() => setMenu(false)}><span className="brand-mark"><Hammer size={19}/></span><span>Wooden <em>Lines</em></span></Link><button className="mobile-menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button><nav className={menu ? 'nav-links open' : 'nav-links'}>{links.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenu(false)}>{label}</NavLink>)}<Link className="admin-link" to="/admin/login" onClick={() => setMenu(false)}>Admin</Link><button className="lang-switch" onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}>{lang === 'en' ? 'தமிழ்' : 'EN'}</button></nav></div></header>;
}
