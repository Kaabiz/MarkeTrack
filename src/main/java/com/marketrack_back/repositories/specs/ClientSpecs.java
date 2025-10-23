// src/main/java/.../repositories/specs/ClientSpecs.java
package com.marketrack_back.repositories.specs;

import com.marketrack_back.entities.Campaign;
import com.marketrack_back.entities.Client;
import org.springframework.data.jpa.domain.Specification;

public final class ClientSpecs {
    private ClientSpecs() {}

    public static Specification<Client> matchesCampaignTarget(Campaign c) {
        return (root, q, cb) -> {
            var p = cb.conjunction();

            if (c.getTargetGender() != null && !c.getTargetGender().isBlank()) {
                p.getExpressions().add(cb.equal(root.get("gender"), c.getTargetGender()));
            }
            if (c.getTargetMinAge() != null) {
                p.getExpressions().add(cb.greaterThanOrEqualTo(root.get("age"), c.getTargetMinAge()));
            }
            if (c.getTargetMaxAge() != null) {
                p.getExpressions().add(cb.lessThanOrEqualTo(root.get("age"), c.getTargetMaxAge()));
            }
            if (c.getTargetOccupation() != null && !c.getTargetOccupation().isBlank()) {
                String like = "%" + c.getTargetOccupation().toLowerCase() + "%";
                p.getExpressions().add(cb.like(cb.lower(root.get("occupation")), like));
            }
            if (c.getTargetLocation() != null && !c.getTargetLocation().isBlank()) {
                String like = "%" + c.getTargetLocation().toLowerCase() + "%";
                p.getExpressions().add(cb.like(cb.lower(root.get("location")), like));
            }
            if (c.getTargetInterests() != null && !c.getTargetInterests().isBlank()) {
                // simple OR over keywords
                var or = cb.disjunction();
                for (String kw : c.getTargetInterests().split(",")) {
                    String like = "%" + kw.trim().toLowerCase() + "%";
                    or.getExpressions().add(cb.like(cb.lower(root.get("interests")), like));
                }
                p.getExpressions().add(or);
            }
            return p;
        };
    }
}
