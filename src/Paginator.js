import React, { useRef, useEffect } from 'react'
import { Grid,Button } from '@material-ui/core';

function Paginator ( {orbs,currentPagIndex,orbsCount,paginationPages,getNextOrbs,getPrevOrbs} ) {
    //console.log(currentPagIndex,orbsCount,paginationPages,orbs.length,orbsCount % paginationPages,'Paginator');
  
    return  (<Grid id="fixedPaginator" item xs={12}>  
            {currentPagIndex+orbs.length-1 > paginationPages ?
            <Button className="btnPaginator" onClick={()=>getPrevOrbs()}> {'<<'} Prev</Button> : <></>}
            { orbs.length == paginationPages  && orbsCount >= currentPagIndex+orbs.length ? <Button className="btnPaginator" onClick={()=>getNextOrbs()}>Next {'>>'}</Button> : <></>
            }
    </Grid>
    );
    
  }

export default Paginator