import React, { useState, useEffect } from 'react'
//styles
import style from './skeleton.css'


const List = ({ height }) => {
  height = height > 40 ? height - 40 : 0
  const arr = new Array(Math.floor(height / 32) + (height % 32 > 16 ? 1 : 0)).fill()
  return (
    <div className={style.head}>
      <div className={style.content}>
        {arr.map((v, i) => (
          <div className={style.row} key={i} />
        ))}
      </div>
    </div>
  )
}

const Skeleton = () => {
  const [root] = useState(React.createRef())
  const [height, setHeight] = useState(0)
  useEffect(() => {
    setHeight(root.current.clientHeight)
  }, [])
  return (
    <div
      ref={root}
      className={style.main}
    >
      <List height={height} />
    </div>
  )
}

export default Skeleton
