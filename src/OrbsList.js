import React, { useRef, useEffect } from 'react'

const OrbsList = orbs => {
    //console.log(orbs);
  return ( orbs.map(orb => {return (<div>{orbs.id} - {orb.owner} - {orb.sample_data}</div> )}) );
}

export default OrbsList