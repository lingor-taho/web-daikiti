# DKT Motors Website Redesign Design

Date: 2026-06-14

## Goal

Redesign the existing DKT Motors website so it no longer feels empty or generic, while preserving the original mobile support and existing website functions. The new site should clearly communicate the company's two business areas, then strongly feature the company's main push: automotive customization work.

The design direction is: professional, spacious, visually strong, and trustworthy. The site should feel like a real automotive service company with strong custom work examples, not a simple static company page.

## Source And Reference Context

Original site: https://daikiti-corp.co.jp/

Reference sites:

- https://moto-exride.com/
- https://tiger-auto.jp/
- https://bike-01.shop/

Key patterns taken from references:

- Large visual case cards with short descriptions.
- Custom work / gallery style entry points.
- Case detail pages with photos and explanatory text.
- Business credibility and company information kept visible, not removed.

## Confirmed Direction

The redesign will follow option B from the visual discussion: "corporate trust + strong case presentation".

The homepage should not start as a pure case gallery. It should first introduce the company and its two businesses, then lead into automotive customization examples.

The confirmed homepage flow is:

1. Hero section: DKT Motors positioning as total car support and custom work provider.
2. Business summary: two compact business cards.
3. Custom work section: brand-filtered case cards using large images.
4. Contact CTA: inquiry entry point.

Detailed company information, access, and longer business explanations should be available on separate pages.

## Existing Functions To Preserve

The original site functions should remain:

- Mobile responsive access.
- Home page.
- Business introduction.
- Company information.
- Access/location information.
- Contact/inquiry form.
- Privacy policy.
- Existing footer/contact information.

Existing content should be migrated or reused where appropriate rather than deleted.

## Business Areas

The homepage will briefly explain both business areas:

- 自動車トータルサービス事業
  - Used car sales.
  - Vehicle purchase/trade-in support.
  - Used car export.
  - General car-life support and consultation.
  - Automotive customization should be presented as the most visible promoted service.

- プラスチックのリサイクル及び輸出
  - Keep this as an existing business line.
  - Summarize on the homepage.
  - Expand on a separate business detail page if needed.

## Automotive Customization Frontend

### Case List

The custom work list should use a visual gallery pattern:

- Large cover image.
- Short title.
- Short summary.
- Brand label.
- Custom area labels, such as exterior, interior, paint, parts, before/after.
- Click card to open detail page.

Filtering should support:

- Brand.
- Optional model.
- Custom category/area.
- Published status.

The brand filter is a required feature. Brands must be maintained in the backend instead of being hard-coded.

Example brand filters:

- ALL
- TOYOTA
- LEXUS
- NISSAN
- HONDA
- Imported cars

The exact brand list can be changed in the admin panel.

### Case Detail

The confirmed detail structure combines A + C:

- Top section: strong Before/After visual comparison.
- Main content: rich text body for custom process explanation.
- Fixed spec area: structured case information.

The detail page should support:

- Cover image.
- Before image.
- After image.
- Case title.
- Brand.
- Model.
- Custom category/area.
- Tags.
- Short summary.
- Rich text process content.
- Multiple inline images in the rich text.
- Optional gallery images.
- Publish date.
- Contact CTA.

The page should be mobile-friendly. On mobile, the spec area should move below the main content or appear as a compact summary block.

## Backend Scope

The backend has two primary feature areas for this phase:

1. Automotive customization case maintenance.
2. Inquiry management for submitted contact forms.

### Custom Case Maintenance

The backend editing approach is confirmed as option C: fixed fields + rich text body.

Fixed fields keep frontend display consistent. Rich text keeps the custom process easy to edit.

Required case fields:

- Title.
- Slug or URL identifier.
- Brand.
- Model.
- Custom category/area.
- Tags.
- Short summary.
- Cover image.
- Before image.
- After image.
- Rich text content.
- Optional gallery images.
- Sort order.
- Published/draft status.
- Featured flag for homepage.
- Created date.
- Updated date.

Admin actions:

- Create case.
- Edit case.
- Delete or archive case.
- Publish/unpublish case.
- Upload and replace images.
- Preview case before publishing.
- Sort or mark featured cases for homepage.

### Brand And Category Maintenance

Brand classification is required.

Backend should support:

- Add/edit/delete vehicle brands.
- Set brand display order.
- Enable/disable brands.
- Add/edit/delete custom categories or areas.
- Set category display order.

Brands and categories should be used by both the admin editor and frontend filters.

### Rich Text Editor Requirements

The rich text editor should support:

- Paragraphs and headings.
- Bold/italic text.
- Bullet and numbered lists.
- Links.
- Image upload.
- Image alignment or simple layout options.
- Captions if feasible.

The editor should be easy for non-technical staff. It should not require HTML editing.

### Inquiry Management

Contact form submissions should be stored and viewable in the backend.

Required inquiry fields:

- Name.
- Email.
- Phone number if present in form.
- Inquiry type if present.
- Message.
- Submitted date/time.
- Read/unread status.
- Admin memo.

Admin actions:

- View inquiry list.
- Open inquiry detail.
- Mark read/unread.
- Add internal memo.
- Filter or search by name, email, and status.

Email notification can be included if the existing site already has it, but the minimum requirement is backend visibility of submitted inquiries.

## UI Design System

The UI should be "beautiful, spacious, and professional".

### Visual Tone

Use a corporate automotive tone:

- Deep black/navy for trust and contrast.
- Metal gray for automotive feel.
- Gold accent for premium emphasis.
- Clean light backgrounds for readability.
- Red only as a restrained action or automotive accent.

Recommended color roles:

- Primary: `#111827`
- Metal gray: `#374151`
- Accent gold: `#f6c85f`
- Clean base: `#f8fafc`
- Action red: `#b91c1c`

### Layout Principles

- Use large real vehicle images whenever possible.
- Keep business sections compact and readable.
- Use strong section headings and enough whitespace.
- Avoid a stiff or empty static layout.
- Avoid purely decorative graphics that do not show vehicles, services, or cases.
- Case cards should be visually dominant and image-led.
- CTA areas should be clear but not loud.

### Frontend Pages

Planned page structure:

- Home.
- Business introduction.
- Custom works list.
- Custom work detail.
- Company information.
- Access.
- Contact.
- Privacy policy.

Navigation should make "改装事例" or "Custom Works" clearly visible.

### Backend UI

The backend should be practical and clear:

- Sidebar navigation.
- Dashboard or simple overview.
- Case list table.
- Case edit form.
- Brand/category maintenance.
- Inquiry list.
- Inquiry detail.

The backend does not need to be visually flashy, but it should be clean and efficient for repeated maintenance work.

## Responsive Requirements

The original site already supports mobile access, and this must be preserved.

Mobile requirements:

- Homepage hero stacks cleanly.
- Business cards stack vertically.
- Brand filters are scrollable or wrap cleanly.
- Case cards become one-column or two-column depending on width.
- Before/After images remain understandable on small screens.
- Rich text content images scale to container width.
- Admin screens should remain usable on tablets; full phone admin support is desirable but secondary.

## Data Model Draft

Implementation can adjust names to match the chosen framework, but the logical model should include:

### Brand

- id
- name
- slug
- sort_order
- is_active
- created_at
- updated_at

### CustomCategory

- id
- name
- slug
- sort_order
- is_active
- created_at
- updated_at

### CustomCase

- id
- title
- slug
- brand_id
- model_name
- summary
- cover_image
- before_image
- after_image
- content
- gallery_images
- status
- is_featured
- sort_order
- published_at
- created_at
- updated_at

### CustomCaseCategory

- custom_case_id
- custom_category_id

### CustomCaseTag

- id
- custom_case_id
- name

### Inquiry

- id
- name
- email
- phone
- inquiry_type
- message
- status
- admin_memo
- submitted_at
- updated_at

## SEO And Content Notes

Important pages should use Japanese page titles and descriptions.

Custom detail pages should include:

- Case title.
- Brand/model.
- Summary.
- Cover image alt text.
- Structured headings in rich text content.

Image alt text should be editable where practical.

## Implementation Assumptions

The current local directory does not contain the original application source. This design document is therefore implementation-independent.

Before implementation, confirm one of the following:

- Existing source code location is provided.
- A new frontend/backend project is created and original site content is migrated.

If an existing codebase is provided, implementation should follow its framework and coding patterns where possible.

## Out Of Scope For First Phase

These can be added later but are not required for the first redesign:

- Online payment.
- User accounts for customers.
- Public comments.
- Inventory/stock vehicle sales system.
- Complex workflow approvals.
- Multi-language support beyond existing content needs.

## Acceptance Criteria

The redesign is successful when:

- Existing site functions are preserved.
- Mobile access remains smooth.
- The homepage clearly communicates both company business areas.
- Automotive customization is clearly visible as the promoted service.
- Custom cases can be managed from the backend.
- Brands and categories can be managed from the backend.
- Users can filter custom cases by brand/category on the frontend.
- Case detail pages show before/after visuals and rich process content.
- Contact form submissions are visible in the backend.
- The UI feels more polished, spacious, and professional than the current site.
