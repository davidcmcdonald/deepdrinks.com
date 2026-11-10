"""Refresh the local Deep Drinks catalogue from David's public Amazon idea lists."""

import json
import re
from pathlib import Path
from tempfile import NamedTemporaryFile
from urllib.parse import parse_qs, urljoin, urlparse

import requests
from bs4 import BeautifulSoup

CATALOG = Path(__file__).resolve().parents[1] / "data" / "amazon.json"
STOREFRONT = "https://www.amazon.com/shop/deepdrinks"
TAG = "letsmakeagame-20"
LISTS = {"reading": "3B4JYUUKHIXCD", "equipment": "1WDTTQA3JAPVK"}


def page(session, url, **kwargs):
    response = session.get(url, timeout=(8, 25), **kwargs)
    response.raise_for_status()
    return BeautifulSoup(response.content, "html.parser", from_encoding="utf-8")


def read_item(card, list_id, existing):
    asin = card["data-asin"].removeprefix("amzn1.asin.")
    link = card.select_one("a.single-product-item-link")
    url = urljoin(STOREFRONT, link["href"])
    target = urlparse(url)
    params = parse_qs(target.query)
    if (not re.fullmatch(r"[A-Z0-9]{10}", asin)
            or target.hostname != "www.amazon.com" or target.path != "/dp/" + asin
            or params.get("tag") != [TAG] or params.get("creativeASIN") != [asin]
            or params.get("asc_item-id") != ["amzn1.ideas." + list_id]):
        raise ValueError(f"Unrecognised affiliate link for {asin}")
    image = urljoin(STOREFRONT, link.select_one("img.product-image")["src"])
    if urlparse(image).hostname not in {"m.media-amazon.com", "images-na.ssl-images-amazon.com"}:
        raise ValueError(f"Unrecognised artwork URL for {asin}")
    # Keep the site's editorial display names when refreshing links and artwork.
    title = link.select_one(".product-title-text").get_text(" ", strip=True)
    byline = link.select_one(".product-brand-text")
    previous = existing.get(asin, {})
    return {"asin": asin, "name": previous.get("name") or title,
            "detail": previous.get("detail") or (byline.get_text(" ", strip=True) if byline else ""),
            "image": image, "url": url}


def read_list(session, list_id, existing):
    list_url = f"{STOREFRONT}/list/{list_id}"
    doc = page(session, list_url, params={"linkCode": "spc", "tag": TAG,
               "domainId": "influencer", "asc_contentid": "amzn1.ideas." + list_id})
    state = next(json.loads(script.string) for script in doc.select("script[data-a-state]")
                 if json.loads(script["data-a-state"]).get("key") == "listScrollState")
    items = {}
    tokens = set()
    while True:
        for card in doc.select(".single-list-item"):
            item = read_item(card, list_id, existing)
            if item["asin"] in items:
                raise ValueError(f"Duplicate card {item['asin']} in {list_id}")
            items[item["asin"]] = item
        if str(state["shouldListLoadMoreFlag"]).lower() == "false":
            return list(items.values())
        token = state.get("pageToken")
        if not token or token in tokens:
            raise ValueError(f"Incomplete pagination for {list_id}")
        tokens.add(token)
        doc = page(session, STOREFRONT + "/api/listItems",
                   params={"linkCode": "spc", "tag": TAG, "listId": list_id, "pageToken": token},
                   headers={"Referer": list_url, "X-Requested-With": "XMLHttpRequest"})
        state = {field["name"]: field.get("value", "") for field in doc.select(".scroll-state input[name]")}


def main():
    previous = json.loads(CATALOG.read_text(encoding="utf-8"))
    updated = {}
    with requests.Session() as session:
        session.headers.update({"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/143.0.0.0 Safari/537.36",
                                "Accept-Language": "en-US,en;q=0.8"})
        for kind, list_id in LISTS.items():
            existing = {item["asin"]: item for item in previous[kind]}
            updated[kind] = read_list(session, list_id, existing)
            print(f"{kind}: {len(updated[kind])} public listings")
    with NamedTemporaryFile("w", encoding="utf-8", newline="\n", dir=CATALOG.parent, delete=False) as output:
        json.dump(updated, output, indent=2, ensure_ascii=False)
        output.write("\n")
    Path(output.name).replace(CATALOG)


if __name__ == "__main__":
    main()
