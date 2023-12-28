import * as React from "react"
import { graphql, HeadFC, PageProps } from "gatsby"

import { renderRichText } from "gatsby-source-contentful"

const RichTextPage = ({
  data,
}: PageProps<Queries.RichTextContentPageQuery>) => {
  if (!data || !data.contentfulContentTypeRichTextContent) {
    return "Not found"
  }
  return (
    <main>
      <h1>{data.contentfulContentTypeRichTextContent.title}</h1>
      {data.contentfulContentTypeRichTextContent.richText &&
        renderRichText(data.contentfulContentTypeRichTextContent.richText)}
    </main>
  );
}

export const query = graphql`
  query RichTextContentPage($sys__id: String) {
    contentfulContentTypeRichTextContent(sys: { id: { eq: $sys__id } }) {
      title
      richText {
        json
      }
    }
  }
`

export const Head: HeadFC<Queries.RichTextContentPageQuery> = ({ data }) => (
  <title>{data.contentfulContentTypeRichTextContent?.title}</title>
)

export default RichTextPage
