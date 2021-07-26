import React, { useRef, useEffect } from 'react'

function OrbsList ( { orbs }) {
  console.log(orbs);
  return ( orbs.map(orb => {return (<div>ID: {orb.id} - Price: {orb.price} - <a target="_blank" href={orb.uri}>See orb</a></div> )}) );
}

export default OrbsList