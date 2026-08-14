import { ArrowUpRight, BookOpen, Compass, Flame, Landmark, ScrollText, Sparkles } from "lucide-react";

const groups = [
  { id:"eastern", number:"01", title:"Eastern Paths", subtitle:"Practice, liberation, relationship, and the subtle self.", color:"#FF7900", icon:Flame, entries:[
    ["Buddhism","The middle way out of suffering—awakening through mindful compassion.",[["BuddhaNet","https://www.buddhanet.net"],["Britannica","https://www.britannica.com/topic/Buddhism"]]],
    ["Taoism","Flowing with the Tao—effortless harmony with the way of nature.",[["Sacred Texts","https://sacred-texts.com/tao/"],["Britannica","https://www.britannica.com/topic/Daoism"]]],
    ["Advaita Vedanta","A nondual Hindu philosophical lineage centered on self-knowledge and ultimate reality.",[["Britannica","https://www.britannica.com/topic/Advaita-school-of-Hindu-philosophy"]]],
    ["Yoga & Tantra","Diverse South Asian traditions engaging ethics, body, breath, devotion, ritual, and liberation.",[["Britannica","https://www.britannica.com/topic/Yoga-philosophy"],["Sacred Texts","https://sacred-texts.com/hin/"]]],
    ["Sikhism","One God, honest living, remembrance, equality, and service.",[["Britannica","https://www.britannica.com/topic/Sikhism"]]],
  ]},
  { id:"earth", number:"02", title:"Earth-Based & Ancestral", subtitle:"Place, reciprocity, healing, kinship, and living cultural knowledge.", color:"#55FF8A", icon:Compass, entries:[
    ["Shamanic Traditions","A broad scholarly term for distinct community-based practices involving spirit, healing, and altered states.",[["Britannica","https://www.britannica.com/topic/shamanism"]]],
    ["Ancient Egyptian / Kemetic","Ma’at, temple traditions, divine order, and changing understandings of death and renewal along the Nile.",[["Britannica","https://www.britannica.com/topic/ancient-Egyptian-religion"]]],
    ["Indigenous & Native Wisdom","Living, diverse traditions that must be approached through specific peoples, teachers, lands, and permissions—not as one universal system.",[["Smithsonian NMAI","https://americanindian.si.edu/"],["UN Indigenous Peoples","https://www.un.org/development/desa/indigenouspeoples/"]]],
  ]},
  { id:"esoteric", number:"03", title:"Western Esoteric & Mystery Traditions", subtitle:"The hidden currents of the West—correspondence, gnosis, and inner transformation.", color:"#C86BFF", icon:Sparkles, entries:[
    ["Hermeticism","Teachings associated with Hermes Trismegistus on mind, cosmos, correspondence, and spiritual rebirth.",[["Britannica","https://www.britannica.com/topic/Hermetic-writings"]]],
    ["Gnosticism","Diverse early movements emphasizing salvific knowledge and the soul’s relation to divine reality.",[["Britannica","https://www.britannica.com/topic/gnosticism"]]],
    ["Theosophy","A modern esoteric movement associated with Blavatsky and a proposed synthesis of religion, philosophy, and science.",[["Theosophical Society","https://www.theosophical.org/"],["Britannica","https://www.britannica.com/topic/theosophy"]]],
    ["Kabbalah","Jewish mystical traditions exploring Torah, divine emanation, creation, prayer, ethics, and the Tree of Life.",[["My Jewish Learning","https://www.myjewishlearning.com/article/kabbalah-mysticism/"],["Britannica","https://www.britannica.com/topic/Kabbala"]]],
    ["Alchemy","Material, philosophical, and spiritual traditions of transformation across multiple cultures and eras.",[["Britannica","https://www.britannica.com/topic/alchemy"]]],
    ["Rosicrucianism","Early-modern manifestos and later organizations shaped around reform, symbolism, and esoteric Christianity.",[["Britannica","https://www.britannica.com/topic/Rosicrucians"]]],
  ]},
  { id:"mystical", number:"04", title:"Mystical & Contemplative Paths", subtitle:"The heart’s direct routes toward the sacred across distinct cultures.", color:"#39A7FF", icon:ScrollText, entries:[
    ["Sufism","Diverse mystical currents within Islam emphasizing remembrance, discipline, love, and closeness to God.",[["Britannica","https://www.britannica.com/topic/Sufism"]]],
    ["Christian Mysticism","Contemplative paths toward union with God across early, medieval, and modern Christian traditions.",[["Britannica","https://www.britannica.com/topic/mysticism/Christian-mysticism"]]],
    ["Jewish Mysticism","A broad lineage including early mystical texts, medieval Kabbalah, Hasidic thought, prayer, and ethical transformation.",[["My Jewish Learning","https://www.myjewishlearning.com/article/jewish-mysticism/"]]],
  ]},
  { id:"philosophy", number:"05", title:"Philosophy & Consciousness", subtitle:"The rational and perennial pursuit of wisdom, virtue, reality, and mind.", color:"#FFE24A", icon:Landmark, entries:[
    ["Stoicism","A Hellenistic philosophy of virtue, judgment, responsibility, and living in agreement with nature.",[["Stanford","https://plato.stanford.edu/entries/stoicism/"],["Britannica","https://www.britannica.com/topic/Stoicism"]]],
    ["Neoplatonism","A philosophical tradition of the One, emanation, intellect, soul, and the return toward source.",[["Stanford","https://plato.stanford.edu/entries/neoplatonism/"]]],
    ["Perennial Philosophy","The debated idea that religions share a common metaphysical or mystical core.",[["Internet Encyclopedia of Philosophy","https://iep.utm.edu/perennial-philosophy/"]]],
    ["Nonduality","A family of teachings that question ordinary divisions between self, awareness, and reality.",[["Stanford","https://plato.stanford.edu/entries/consciousness/" ]]],
    ["Anthroposophy","Rudolf Steiner’s spiritual-philosophical movement and its cultural, educational, and historical legacy.",[["Britannica","https://www.britannica.com/topic/anthroposophy"]]],
  ]},
];

export default function TraditionsPage(){return <div className="page traditions-page"><section className="traditions-hero"><div><p className="kicker">The traditions atlas</p><h1 data-testid="traditions-heading">Many paths.<br/><em>Context before claims.</em></h1><p data-testid="traditions-description">Explore living religions, philosophies, mystical lineages, and modern esoteric movements without flattening them into one story. Every entry begins with origin, vocabulary, and respectful sources.</p></div><div className="atlas-compass" aria-hidden="true"><BookOpen/><span>history</span><span>practice</span><span>ethics</span><span>experience</span></div></section>{groups.map(({id,number,title,subtitle,color,icon:Icon})=><section key={id} className="tradition-group" style={{"--group-color":color}} data-testid={`tradition-group-${id}`}><header><div><span>{number}</span><Icon/></div><div><h2>{title}</h2><p>{subtitle}</p></div></header><div className="tradition-cards">{groups.find((group)=>group.id===id).entries.map(([name,text,links],index)=><article key={name} data-testid={`tradition-${id}-${index+1}`}><span className="card-flare" aria-hidden="true">✦</span><h3>{name}</h3><p>{text}</p><div className="source-links">{links.map(([label,url],linkIndex)=><a href={url} target="_blank" rel="noreferrer" key={label} data-testid={`tradition-${id}-${index+1}-source-${linkIndex+1}`}>{label}<ArrowUpRight size={14}/></a>)}</div></article>)}</div></section>)}</div>}