import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { projectApi } from '../api/services';
const photos = [
 ['Modular Kitchen Cabinet','kitchen','/images/kitchen-cabinet.jpeg','மாடுலர் கிச்சன் கேபினெட்'],
 ['Dressing Mirror Unit','wardrobe','/images/dressing-mirror.jpeg','டிரெஸ்ஸிங் மிரர்'],
 ['Office Interior Design','office','/images/office-interior.jpeg','அலுவலக இன்டீரியர்'],
 ['Pooja Cabinet Design','interior','/images/pooja-cabinet.jpeg','பூஜை அறை அலமாரி'],
 ['Pooja Room Design 1','interior','/images/pooja-room-1.jpeg','பூஜை அறை வடிவமைப்பு 1'],
 ['Pooja Room Design 2','interior','/images/pooja-room-2.jpeg','பூஜை அறை வடிவமைப்பு 2'],
 ['Pooja Room Design 3','interior','/images/pooja-room-3.jpeg','பூஜை அறை வடிவமைப்பு 3'],
 ['Room Door Design','doors','/images/room-door.jpeg','கதவு வடிவமைப்பு'],
];
export default function Gallery() {
 const [category,setCategory]=useState('all'), [search,setSearch]=useState(''); const {data:projects,loading,error}=useFetch(()=>projectApi.list({category:category==='all'?undefined:category,search:search||undefined,limit:50}),[category,search]);
 const items=projects?.length ? projects.map((p,i)=>({...p,localImage:photos[i%photos.length][2]})) : photos.map(([title,cat,image,ta])=>({title,category:cat,image,ta,localImage:image,description:'Portfolio photo from Wooden Lines.'}));
 const filtered=useMemo(()=>items.filter(p=>!search||`${p.title} ${p.description||''}`.toLowerCase().includes(search.toLowerCase())),[items,search]);
 return <section className="page-section"><div className="container"><div className="page-hero"><span className="eyebrow">PROJECT GALLERY / புகைப்படங்கள்</span><h1>Real work. Real spaces.</h1><p>A visual record of custom kitchens, storage, interiors, doors and traditional woodwork.</p></div><div className="gallery-toolbar"><div className="filter-tabs">{['all','kitchen','wardrobe','furniture','interior','doors','office','other'].map(c=><button className={category===c?'active':''} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects"/></label></div>{error && <div className="notice">Backend unavailable — showing the supplied portfolio photos. Connect the API to load database projects.</div>}{loading ? <div className="page-state">Loading projects…</div> : <div className="gallery-grid">{filtered.map((p,i)=><Link className="gallery-card" to={p.slug?`/projects/${p.slug}`:'/gallery'} key={p._id||p.title}><div className="gallery-image"><img src={p.coverImage||p.images?.[0]||p.localImage||p.image} alt={p.title}/><span>{p.category}</span></div><div className="gallery-copy"><h3>{p.title}</h3><p>{p.ta || p.description}</p><span className="under-link">View project <ArrowRight size={15}/></span></div></Link>)}</div>}</div></section>;
}
