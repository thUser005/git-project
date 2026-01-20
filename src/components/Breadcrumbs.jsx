export default function Breadcrumbs({ parts, onNavigate }) {
  const accum = []
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-2">
        <li className="breadcrumb-item"><a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('')}}>root</a></li>
        {parts.map((p, idx)=>{
          accum.push(p)
          const path = accum.join('/')
          const isLast = idx === parts.length-1
          return (
            <li key={idx} className={`breadcrumb-item ${isLast?'active':''}`} aria-current={isLast?'page':undefined}>
              {isLast ? p : (<a href="#" onClick={(e)=>{e.preventDefault(); onNavigate(path)}}>{p}</a>)}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
