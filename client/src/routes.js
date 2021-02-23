import React from 'react'
import {Switch, Route} from 'react-router-dom'
import {LinksPage} from './pages/LinksPage'
import {DetailPage} from './pages/DetailPage'
import {CreatePage} from './pages/CreatePage'

export const useRoutes = isAuthenticated =>{
    if (isAuthenticated){
        return(
            <Switch>
               <Route path="/links" exact>
                 <LinksPage />
               </Route>
               <Route path="/create" exact>
                 <CreatePage />
               </Route>
               <Route path="/detail/:id" >
                 <DetailPage />
               </Route>
            </Switch>
        )
    }

    return (
        <Switch></Switch>
    )
}