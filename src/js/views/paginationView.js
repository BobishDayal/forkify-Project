import icons from 'url:../../img/icons.svg'
import view from "./view";


class paginationView extends view{

_parentEl = document.querySelector('.pagination');

addHandlerClick (handler){

    this._parentEl.addEventListener('click', function(e){

        const btn = e.target.closest('.btn--inline');
        if(!btn) return;


        const goToPage = +btn.dataset.goto;
        handler(goToPage);
        
  })
}


_generateMarkup (){

    const numPages = Math.ceil(this._data.results.length/ this._data.resultPerPage);
    const curPage = this._data.page;
   // page 1 and there are other pages
   if(curPage === 1 && numPages > 1){
   return this._generateMarkupPageNext(curPage);

   }

   
   //last page 
   if(curPage === numPages && numPages > 1){
     return this._generateMarkupPagePrev(curPage);
   }
   
   
   //in between the pages 
    if(curPage < numPages ){
    return `${this._generateMarkupPageNext(curPage)}
     ${this._generateMarkupPagePrev(curPage)}`

    }

   
   //page 1 and there are NO other pages
   return '' ;

}

_generateMarkupPagePrev(curPage){
    return `
    <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span> Page ${curPage - 1}</span>
          </button>`

}

_generateMarkupPageNext(curPage){
    return `
    <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`
    
}

}

export default new paginationView();