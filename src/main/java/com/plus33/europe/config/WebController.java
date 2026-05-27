package com.plus33.europe.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * WebController
 * ══════════════════════════════════════════════════
 * PURPOSE:
 * Forwards all non-asset SPA routes to index.html so
 * the client-side router (router.js) can handle
 * navigation. Without this, refreshing on any sub-route
 * (e.g. /franchise) would return a 404 from Spring.
 *
 * ARCHITECTURE NOTES:
 * - Static assets (/css/*, /js/*, /assets/*, /global/*,
 *   /pages/*) are served directly by Spring's default
 *   ResourceHttpRequestHandler — this controller is
 *   never invoked for those paths.
 * - Spring Security permits all requests (SecurityConfig).
 *
 * DEVELOPED BY : MIRRO
 * CODED BY     : SIVASURYA
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
        "/find-us"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
