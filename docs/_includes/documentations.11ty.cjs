const page = require('./page.11ty.cjs');
const relative = require('./relative-path.cjs');
const _ = require('lodash');

/**
 * This template extends the page template and adds an documents list.
 */
module.exports = function (data) {
  return page({
    ...data,
    content: renderDocuments(data),
  });
};

const renderDocuments = ({name, content, collections, page}) => {
    const sortedDocuments = _.sortBy(collections.documentation || [], (x)=> {
        return x.data.sort || 0;
    })

  return `
    <h1>${name}</h1>
    <section class="documentation">
      <nav class="collection">
        <ul>
          ${sortedDocuments
                  .map(
                    (post) => `
                  <li class=${post.url === page.url ? 'selected' : ''}>
                    <a href="${relative(
                      page.url,
                      post.url
                    )}">${post.data.description.replace('<', '&lt;')}</a>
                  </li>
                `
                  )
                  .join('')
          }
        </ul>
      </nav>
      <div>
        ${content}
      </div>
    </section>
  `;
};
