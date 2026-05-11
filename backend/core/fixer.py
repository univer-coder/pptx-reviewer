import io
from pptx import Presentation
from .rules.base import Style
from .rules.font import BodyFontSizeRule, FontFamilyRule
from .rules.layout import TitlePositionRule, BackgroundColorRule

FIXABLE_RULES = [
    BodyFontSizeRule(),
    FontFamilyRule(),
    TitlePositionRule(),
    BackgroundColorRule(),
]


def fix(pptx_bytes: bytes, style: Style) -> bytes:
    prs = Presentation(io.BytesIO(pptx_bytes))

    for slide in prs.slides:
        for rule in FIXABLE_RULES:
            try:
                rule.fix(slide, prs, style)
            except Exception:
                pass

    output = io.BytesIO()
    prs.save(output)
    return output.getvalue()
