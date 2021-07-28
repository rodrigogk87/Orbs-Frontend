import React, { useRef, useEffect } from 'react'
import { Grid,Button } from '@material-ui/core';

function Paginator ( {orbs,currentPagIndex,orbsCount,paginationPages,getNextOrbs,getPrevOrbs} ) {
    //console.log(currentPagIndex,orbsCount,paginationPages);
  
    return  (<Grid item xs={12}>  
            {currentPagIndex+orbs.length-1 > paginationPages ?
            <Button className="btnPaginator" onClick={()=>getPrevOrbs()}> {'<<'} Prev</Button> 
            : currentPagIndex < orbsCount ? <Button className="btnPaginator" onClick={()=>getNextOrbs()}>Next {'>>'}</Button> : <></>
            }
    </Grid>
    );
    
  }

export default Paginator