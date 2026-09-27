import { useState } from 'react';
import { MessageCircle, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const PHONE = '+919842234749';
export default function ChatWidget({ lang = 'en' }) {
  const [open, setOpen] = useState(false), [step, setStep] = useState('start');
  const ta = lang === 'ta';
  const reset = () => setStep('start');
  const options = step === 'start' ? [
    { label: ta ? 'ஆம், கோவை பகுதியில்' : 'Yes, my project is in Coimbatore', next: 'local' },
    { label: ta ? 'இல்லை, வேறு ஊர்' : 'No, I am from another city', next: 'outside' },
  ] : step === 'local' ? [
    { label: ta ? 'புகைப்படங்களை பார்க்க' : 'View project photos', next: 'photos' },
    { label: ta ? 'தொடர்பு விபரம்' : 'Get contact details', next: 'contact' },
    { label: ta ? 'வாட்ஸ்அப்பில் பேச' : 'Message on WhatsApp', next: 'whatsapp' },
  ] : [];
  const message = { start: ta ? 'வணக்கம்! உங்கள் தச்சு அல்லது இன்டீரியர் வேலை கோயம்புத்தூர் பகுதியில் உள்ளதா?' : 'Hello! Is your carpentry or interior project located around Coimbatore?', local: ta ? 'மிக்க மகிழ்ச்சி! மாடுலர் கிச்சன், வார்ட்ரோப், ஃபர்னிச்சர், கதவுகள் மற்றும் இன்டீரியர் வேலைகளை நாங்கள் செய்கிறோம்.' : 'Great. We handle modular kitchens, wardrobes, furniture, doors and interior carpentry.', outside: ta ? 'தற்போது கோயம்புத்தூர் மற்றும் அருகிலுள்ள பகுதிகளில் மட்டுமே நேரடி வேலைகளை ஏற்றுக்கொள்கிறோம்.' : 'For now, projects are handled in Coimbatore and nearby local areas so the work can be supervised closely.', photos: '', contact: ta ? `பாஸ்கரன் K T: ${PHONE}` : `Baskaran K T: ${PHONE}`, whatsapp: '' }[step];
  const setNext = (next) => setStep(next);
  return <div className="chat-widget"><button className="chat-toggle" onClick={() => setOpen(!open)}>{open ? <X size={18}/> : <MessageCircle size={18}/>} {ta ? 'எங்களிடம் கேளுங்கள்' : 'Ask Wooden Lines'}</button>{open && <div className="chat-box"><div className="chat-head"><div><strong>Wooden Lines Guide</strong><span>{ta ? 'உதவி' : 'Quick help'}</span></div><button onClick={() => setOpen(false)}><X size={18}/></button></div><div className="chat-body"><div className="chat-bubble bot">{message}</div>{step === 'outside' && <div className="chat-bubble bot">{ta ? 'எங்கள் பணிகளை புகைப்படங்களில் பார்க்கலாம்.' : 'You can still browse our project gallery.'}</div>}{step === 'local' && <div className="chat-bubble bot">{ta ? 'உங்களுக்கு என்ன வேண்டும்?' : 'What would you like to see?'}</div>}{step === 'contact' && <div className="chat-bubble bot">{ta ? 'அழைக்கலாம் அல்லது வாட்ஸ்அப்பில் தொடர்பு கொள்ளலாம்.' : 'You can call or message directly on WhatsApp.'}</div>}</div><div className="chat-actions">{step === 'outside' && <Link className="chat-link" to="/gallery" onClick={() => setOpen(false)}>View photos <ArrowRight size={15}/></Link>}{step === 'photos' && <Link className="chat-link" to="/gallery" onClick={() => setOpen(false)}>Open gallery <ArrowRight size={15}/></Link>}{step === 'contact' && <><a className="chat-link" href={`tel:${PHONE}`}>Call now <ArrowRight size={15}/></a><a className="chat-link" href={`https://wa.me/${PHONE.replace('+','')}`} target="_blank" rel="noreferrer">WhatsApp <ArrowRight size={15}/></a></>}{step === 'whatsapp' && <a className="chat-link" href={`https://wa.me/${PHONE.replace('+','')}?text=${encodeURIComponent('Hello Wooden Lines! I would like to discuss a carpentry/interior project.')}`} target="_blank" rel="noreferrer">Open WhatsApp <ArrowRight size={15}/></a>}{options.map((o) => <button key={o.next} className="chat-option" onClick={() => setNext(o.next)}>{o.label}</button>)}{step !== 'start' && <button className="chat-reset" onClick={reset}>Start over</button>}</div></div>}</div>;
}
