import React, { useState, useEffect } from 'react'

const Skeleton = () => {
  const [root] = useState(React.createRef())
  useEffect(() => {
    const div = root.current
  }, [])
  useEffect(() => {

  })
  return (
    <div
      ref={root}
    >
      
    </div>
  )
}

export default Skeleton
