from app import Session, BlogPost
from datetime import datetime

def create_guide_post():
    session = Session()
    
    # Create a markdown guide post
    guide_post = BlogPost(
        title="Markdown and LaTeX Guide",
        content="""# Markdown and LaTeX Guide

This post demonstrates how to use Markdown and LaTeX in your blog posts.

## Basic Markdown

You can use Markdown for basic formatting:

### Text Formatting

- **Bold text** is created with `**Bold text**`
- *Italic text* is created with `*Italic text*`
- ~~Strikethrough~~ is created with `~~Strikethrough~~`

### Lists

Unordered list:
- Item 1
- Item 2
  - Nested item

Ordered list:
1. First item
2. Second item
3. Third item

### Links and Images

[Link to Google](https://google.com) is created with `[Link to Google](https://google.com)`

## Code Blocks

You can create code blocks with syntax highlighting:

```javascript
// JavaScript code
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('World');
```

```python
# Python code
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
        
print(list(fibonacci(10)))
```

```css
/* CSS code */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

## LaTeX Math

### Inline Math

You can write inline equations like $E = mc^2$ or $f(x) = x^2 + 3x + 2$

### Block Math

For more complex equations, use block math:

$$
\\frac{d}{dx}\\left( \\int_{a}^{x} f(u)\\,du\\right)=f(x)
$$

$$
\\begin{align*}
\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\
\\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\
\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} & = \\vec{\\mathbf{0}} \\\\
\\nabla \\cdot \\vec{\\mathbf{B}} & = 0
\\end{align*}
$$

### Matrix Example

$$
\\begin{pmatrix}
a & b & c \\\\
d & e & f \\\\
g & h & i
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y \\\\
z
\\end{pmatrix}
=
\\begin{pmatrix}
ax + by + cz \\\\
dx + ey + fz \\\\
gx + hy + iz
\\end{pmatrix}
$$

## Combined Examples

You can even combine code and math in your explanations:

When implementing the sigmoid function $\\sigma(x) = \\frac{1}{1 + e^{-x}}$, you can use this code:

```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Test the function
x = np.linspace(-10, 10, 100)
y = sigmoid(x)
```

Happy writing!
""",
        slug="markdown-latex-guide",
        published=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    try:
        # Add and commit the post
        session.add(guide_post)
        session.commit()
        print("Markdown guide post created successfully!")
        print(f"ID: {guide_post.id}, Title: {guide_post.title}, Slug: {guide_post.slug}, Published: {guide_post.published}")
    except Exception as e:
        session.rollback()
        print(f"Error creating guide post: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    create_guide_post() 