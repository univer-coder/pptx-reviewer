from __future__ import annotations
from dataclasses import dataclass, field
from typing import Literal, Any
from enum import Enum
from abc import ABC, abstractmethod


class Style(str, Enum):
    STANDARD = "standard"
    IMPACT = "impact"
    VISUAL = "visual"


@dataclass
class Issue:
    rule_id: str
    severity: Literal["error", "warning", "info"]
    auto_fixable: bool
    message: str
    suggestion: str
    details: dict[str, Any] = field(default_factory=dict)


class BaseRule(ABC):
    rule_id: str
    auto_fixable: bool = False

    @abstractmethod
    def check(self, slide, presentation, style: Style) -> list[Issue]:
        ...


class BaseFixableRule(BaseRule, ABC):
    auto_fixable: bool = True

    @abstractmethod
    def check(self, slide, presentation, style: Style) -> list[Issue]:
        ...

    @abstractmethod
    def fix(self, slide, presentation, style: Style) -> None:
        ...
