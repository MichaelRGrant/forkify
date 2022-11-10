import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render the recieved Object to the DOM.
   *
   * @param {Object | Object[]} data The data to be rendered.
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM.
   * @returns {undefined | string} A markup string when render is false.
   * @this {Object} View instances
   * @author Michael Grant
   * @todo Finish implementation.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // convert string to DOM objects that live in memory but not rendered on page
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      // change elements that only contain text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // update changed attributes
      // I don't need to do this, because I used different attributes. Look
      // to the final code to see how this is done.
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
                <svg>
                <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
            <div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }
}
