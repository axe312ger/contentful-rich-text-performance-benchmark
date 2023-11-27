import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"

import { renderRichText } from "gatsby-source-contentful/rich-text"
import { Options } from "@contentful/rich-text-react-renderer"


const options: Options = {
}

const RichTextPage = ({
  data,
}: PageProps<Queries.RichTextContentPageQuery>) => {
  if (!data || !data.contentfulRichTextContent) {
    return "Not found"
  }
  return (
    <main>
      <h1>{data.contentfulRichTextContent.title}</h1>
      {data.contentfulRichTextContent.richText &&
        renderRichText(data.contentfulRichTextContent.richText, options)}
    </main>
  )
}

export const query = graphql`
  query RichTextContentPage($contentful_id: String) {
    contentfulRichTextContent(contentful_id: { eq: $contentful_id }) {
      title
      richText {
        raw
      }
    }
  }
`

export const Head: HeadFC<Queries.RichTextContentPageQuery> = ({ data }) => (
  <title>{data.contentfulRichTextContent?.title}</title>
)

export default RichTextPage
