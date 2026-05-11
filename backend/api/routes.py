from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from core.rules.base import Style
from core import parser, fixer

router = APIRouter()

ALLOWED_CONTENT_TYPES = {
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/octet-stream",
}


def _validate_pptx(file: UploadFile) -> None:
    if not file.filename.endswith(".pptx"):
        raise HTTPException(status_code=400, detail="PPTXファイルのみ対応しています")


@router.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    style: str = Form("standard"),
):
    _validate_pptx(file)
    try:
        style_enum = Style(style)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"無効なスタイルです: {style}")

    pptx_bytes = await file.read()
    # PPTXはZIPファイル。先頭4バイトがPK\x03\x04でなければ無効
    if len(pptx_bytes) < 4 or pptx_bytes[:4] != b'PK\x03\x04':
        raise HTTPException(
            status_code=422,
            detail=f"有効なPPTXファイルではありません（サイズ: {len(pptx_bytes)}バイト）"
        )
    try:
        result = parser.analyze(pptx_bytes, style_enum)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"ファイルの解析に失敗しました: {str(e)}")

    return result


@router.post("/fix")
async def fix_pptx(
    file: UploadFile = File(...),
    style: str = Form("standard"),
):
    _validate_pptx(file)
    try:
        style_enum = Style(style)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"無効なスタイルです: {style}")

    pptx_bytes = await file.read()
    try:
        fixed_bytes = fixer.fix(pptx_bytes, style_enum)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"修正処理に失敗しました: {str(e)}")

    filename = file.filename.replace(".pptx", "_fixed.pptx")
    return Response(
        content=fixed_bytes,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
