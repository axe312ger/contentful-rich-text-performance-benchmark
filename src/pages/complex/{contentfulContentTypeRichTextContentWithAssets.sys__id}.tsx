import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import { renderRichText, MakeOptions } from "gatsby-source-contentful"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"

const Bold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bold">{children}</span>
)
const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="align-center">{children}</p>
)

const makeOptions: MakeOptions = ({
  assetBlockMap,
  assetHyperlinkMap,
  entryBlockMap,
  entryInlineMap,
  entryHyperlinkMap,
}) => ({
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.EMBEDDED_ASSET]: node => {
      const image = assetBlockMap.get(node.data.target.sys.id)
      return (image && image.gatsbyImageData )? (
        <GatsbyImage
          image={image.gatsbyImageData}
          alt={image.description || ""}
        />
      ) : null
    },
  },
})

const RichTextPage = ({
  data,
}: PageProps<Queries.RichTextContentPageWithAssetsQuery>) => {
  if (!data.contentfulContentTypeRichTextContentWithAssets) {
    return "Not found"
  }
  return (
    <main>
      <h1>{data.contentfulContentTypeRichTextContentWithAssets.title}</h1>
      {data.contentfulContentTypeRichTextContentWithAssets.richText &&
        renderRichText(
          data.contentfulContentTypeRichTextContentWithAssets.richText,
          makeOptions
        )}
    </main>
  )
}

export const query = graphql`
  query RichTextContentPageWithAssets($sys__id: String) {
    contentfulContentTypeRichTextContentWithAssets(
      sys: { id: { eq: $sys__id } }
    ) {
      title
      richText {
        json
        links {
          assets {
            block {
              sys {
                id
              }
              gatsbyImageData
            }
          }
        }
      }
    }
  }
`

export const Head: HeadFC<Queries.RichTextContentPageQuery> = ({ data }) => (
  <title>{data.contentfulContentTypeRichTextContent?.title}</title>
)

export default RichTextPage
