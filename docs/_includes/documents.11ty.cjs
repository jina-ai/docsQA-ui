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
    const sortedDocuments = _.sortBy(collections.documents || [], (x)=> {
        const fileName = x.inputPath;

        if (fileName.includes('index.')) {
            return 0;
        }

        return fileName;
    })

  return `
    <h1>${name}</h1>
    <section class="documents">
      <nav class="collection">
        <ul>
          ${sortedDocuments
                  .sort((a, b)=> {
                      if (a.inputPath.indexOf('index') >= 0) {
                          return -1;
                      }
                      if (a.inputPath > b.inputPath) {
                          return 1;
                      } else if (a.inputPath === b.inputPath) {
                          return 0;
                      }
                      return -1;
                  })
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
