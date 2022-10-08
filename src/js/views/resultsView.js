
import icons from 'url:../../img/icons.svg'
import previewView from './previewView';
import view from "./view";



class resultsView extends view {

    _parentEl = document.querySelector('.results');
    _errorMessage = "We couldn't find your query. Please try another one!";
    _message = '';
    

    

    _generateMarkup (){
      
      return this._data.map(result => previewView.render(result, false)).join('')
 
      }

   

}

export default new resultsView();