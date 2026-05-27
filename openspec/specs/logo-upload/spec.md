# Logo Upload

## Purpose

Provides click-to-select and drag-and-drop image upload with base64 encoding, file validation, preview, and removal.

## Requirements

### Requirement: Logo file selection
`useLogoUpload` MUST support click-to-select image file via a hidden `<input type="file">`.

#### Scenario: Image selected via click
- **WHEN** user clicks the logo upload area
- **THEN** a file picker dialog opens for image files

### Requirement: Drag-and-drop support
`useLogoUpload` MUST support drag-and-drop of image files onto the upload area.

#### Scenario: Image dropped
- **WHEN** a user drags and drops an image file onto the upload area
- **THEN** the logo is processed and a preview is shown

### Requirement: Base64 encoding
Selected/dropped images MUST be encoded to base64 data URL for in-memory storage.

#### Scenario: Image encoded
- **WHEN** a valid image file is selected
- **THEN** it is converted to a base64 data URL string

### Requirement: File type and size validation
`useLogoUpload` MUST validate file type (image) and size (max 2MB), showing error toast on violation.

#### Scenario: Oversized file rejected
- **WHEN** a file larger than 2MB is selected
- **THEN** an error toast is shown and the logo is not set

#### Scenario: Non-image file rejected
- **WHEN** a non-image file is selected
- **THEN** an error toast is shown and the logo is not set

### Requirement: Logo preview and removal
The upload area MUST show a preview of the encoded logo and provide a remove button.

#### Scenario: Logo preview shown
- **WHEN** a logo is successfully uploaded
- **THEN** the upload area displays the image preview

#### Scenario: Logo removed
- **WHEN** user clicks the remove button
- **THEN** the logo is cleared
