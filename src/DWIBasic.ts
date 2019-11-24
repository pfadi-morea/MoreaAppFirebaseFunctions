
export class DWIBasics{
    
    check4DocDeleted(olddoc:any, newdoc:any){
        if(olddoc.exists && !newdoc.exists)
            return true;
        else
            return false;
    }
}