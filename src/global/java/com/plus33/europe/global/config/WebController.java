package com.plus33.europe.global.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * WebController
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Forwards all non-asset SPA routes to index.html so
 * the client-side router (router.js) can handle
 * navigation. Without this, refreshing on any sub-route
 * (e.g. /franchise, /about, /product/1) would return a 404.
 * ══════════════════════════════════════════════════
 */
@Controller
public class WebController {

    /**
     * Catch-all for SPA client routes.
     * Forwards to index.html which bootstraps the JS router.
     */
    @RequestMapping(value = {
        "/",
        "/store",
        "/journal",
        "/franchise",
        "/find-us",
        "/about",
        "/rewards",
        "/product/{id}"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
