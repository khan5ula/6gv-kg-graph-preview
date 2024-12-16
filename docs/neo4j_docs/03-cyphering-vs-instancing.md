# Approaches to Initializing and Populating Neo4j Database

Kristian Hannula, 21.02.2024

This document outlines two primary methodologies for database initialization and data insertion in Neo4j: utilizing Cypher queries vs. adopting a comprehensive RDF strategy. Both approaches have advantages and considerations.

## 1. Utilizing Cypher Queries

Cypher, resembling SQL, is the native query language for Neo4j. It enables the programmatic creation, merging, and updating of nodes through the Neo4j driver plugin.
Advantages of cypher queries:

* Native Integration: Direct support from Neo4j enchances reliability

* Ease of Use: SQL-like syntax is relatively simple

Considerations:

    RDF schema overriding: Cypher queries seem to bypass constraints defined by an RDF schema imported via the Neo4j Neosemantics plugin.

    Schema compatibility: I can keep studying the possibilities of enforcing the RDF schema constraints through Cypher and/or the Neosemantics plugin.

Implementation Notes:

    Maintaining OWL/RDF ontology as the database model while keeping data mapping logic separate offers a straightforward implementation path.
    
    A prototype demonstrating JSON data processing and insertion into Neo4j using Cypher queries has already been developed.

Implemention time estimate from this point on:

    25 hours
    Tasks: query implementations, transforming the prototype into a middleware component

## 2. Adopting a Full RDF Strategy

This approach aligns more closely with the preferences of clients aiming for a direct integration of ontology RDF files with data mapping logic.
Advantages:

    Client expectations: Directly utilizes RDF, potentially offering a more semantically rich and interconnected data model.

    Ontology-Driven Data Mapping: Enables the creation of instances directly from RDF files, aiming to maintain semantic consistency and expressiveness.

Considerations:

    Ontology Reflection in Neo4j: Given that RDF support in Neo4j hinges on the Neosemantics plugin, the representation of the ontology within the graph database may not fully capture its properties. This is still under investigation.

    Important! Ontology Updates: Modifications to the ontology must be mirrored in the source code to ensure consistency between the data model and the application logic since the data mapping is done in the Javascript application in any case. In other words, when updating the ontology, the source code also requires manual updates. This may ultimately kill off the benefits gained from integration of the RDF ontology within the system.

Implementation Challenges:

    A functional prototype leveraging RDF for data mapping has yet to be successfully implemented. Challenges include the portrayal of RDF ontologies within Neo4j and the need for further research into optimizing the import process of the RDF to Neo4J.

Implemention time estimate from this point on:

    50 hours
    Tasks: studying the technologies, query implementations, transforming the prototype into a middleware component, integrating the RDF source file

## Conclusion

At this stage, option 1. with the choice of keeping the RDF ontology as a data model and separating the data mapping from it seems to be the most promising choice for creating a functional application within the timeframe of the project.