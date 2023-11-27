import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import { renderRichText } from "gatsby-source-contentful/rich-text"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import { Options } from "@contentful/rich-text-react-renderer"

const Bold: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bold">{children}</span>
)
const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="align-center">{children}</p>
)

const options: Options = {
  renderMark: {
    [MARKS.BOLD]: text => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
    [BLOCKS.EMBEDDED_ASSET]: node => {
      const image = getImage(node.data.target)
      return image ? (
        <GatsbyImage image={image} alt={node.data.target.description} />
      ) : null
    },
  },
}

const RichTextPage = ({
  data,
}: PageProps<Queries.RichTextContentPageWithAssetsQuery>) => {
  if (!data.contentfulRichTextContentWithAssets) {
    return "Not found"
  }
  return (
    <main>
      <h1>{data.contentfulRichTextContentWithAssets.title}</h1>
      {data.contentfulRichTextContentWithAssets.richText &&
        renderRichText(
          data.contentfulRichTextContentWithAssets.richText,
          options
        )}
    </main>
  )
}

export const query = graphql`
  query RichTextContentPageWithAssets($contentful_id: String) {
    contentfulRichTextContentWithAssets(contentful_id: { eq: $contentful_id }) {
      title
      richText {
        raw
        references {
          ... on ContentfulAsset {
            contentful_id
            __typename
            gatsbyImageData
          }
        }
      }
    }
  }
`

export const Head: HeadFC<Queries.RichTextContentPageQuery> = ({ data }) => (
  <title>{data.contentfulRichTextContent?.title}</title>
)

export default RichTextPage
